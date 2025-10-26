from datetime import datetime, timedelta
from sqlalchemy import func, extract
from models import db, Emission, MonthlySummary

class EmissionService:
    
    # Emission factors (kg CO2 per unit)
    EMISSION_FACTORS = {
        'transport': {
            'car': 0.21,      # kg CO2 per km
            'bus': 0.08,
            'train': 0.04,
            'motorcycle': 0.11,
            'plane': 0.25,
            'diesel_vehicle': 2.68,  # kg CO2 per liter
            'petrol_vehicle': 2.31,
        },
        'electricity': {
            'average': 0.475,  # kg CO2 per kWh
            'coal': 0.82,
            'natural_gas': 0.49,
            'renewable': 0.05,
        },
        'food': {
            'beef': 25.5,     # kg CO2 per kg
            'chicken': 5.4,
            'pork': 6.2,
            'rice': 2.7,
        }
    }
    
    @staticmethod
    def calculate_emissions(emission_type, original_value, unit, **kwargs):
        """Calculate CO2 emissions based on type and parameters"""
        try:
            if emission_type == 'transport':
                return EmissionService._calculate_transport_emissions(original_value, unit, **kwargs)
            elif emission_type == 'electricity':
                return EmissionService._calculate_electricity_emissions(original_value, unit, **kwargs)
            elif emission_type == 'food':
                return EmissionService._calculate_food_emissions(original_value, unit, **kwargs)
            else:
                # For asset-based or other emissions
                return original_value  # Assume value is already in kg CO2
                
        except Exception as e:
            print(f"Calculation error: {e}")
            return 0.0
    
    @staticmethod
    def _calculate_transport_emissions(distance, unit, vehicle_type='car', fuel_type=None):
        """Calculate transport emissions"""
        if unit == 'km':
            factor = EmissionService.EMISSION_FACTORS['transport'].get(vehicle_type, 0.21)
            return distance * factor
        elif unit == 'liters':
            factor = EmissionService.EMISSION_FACTORS['transport'].get(fuel_type, 2.31)
            return distance * factor
        else:
            return distance  # Assume already in kg CO2
    
    @staticmethod
    def _calculate_electricity_emissions(usage, unit, energy_source='average'):
        """Calculate electricity emissions"""
        if unit == 'kWh':
            factor = EmissionService.EMISSION_FACTORS['electricity'].get(energy_source, 0.475)
            return usage * factor
        else:
            return usage  # Assume already in kg CO2
    
    @staticmethod
    def _calculate_food_emissions(quantity, unit, food_type='average'):
        """Calculate food emissions"""
        if unit == 'kg':
            factor = EmissionService.EMISSION_FACTORS['food'].get(food_type, 5.0)
            return quantity * factor
        else:
            return quantity  # Assume already in kg CO2
    
    @staticmethod
    def record_emission(user_id, emission_data):
        """Record a new emission with automatic calculation"""
        try:
            # Calculate CO2 emissions
            co2_amount = EmissionService.calculate_emissions(
                emission_type=emission_data.get('emission_type', 'other'),
                original_value=emission_data['original_value'],
                unit=emission_data.get('unit', 'kg'),
                **emission_data.get('calculation_params', {})
            )
            
            # Create emission record
            emission = Emission(
                user_id=user_id,
                asset_id=emission_data.get('asset_id'),
                emission_type=emission_data.get('emission_type', 'other'),
                activity=emission_data.get('activity', ''),
                source=emission_data.get('source', 'Manual Entry'),
                original_value=emission_data['original_value'],
                unit=emission_data.get('unit', 'kg'),
                amount=co2_amount,
                calculation_method=emission_data.get('calculation_method', 'standard'),
                emission_factor=emission_data.get('emission_factor'),
                date=emission_data.get('date', datetime.now().date())
            )
            
            db.session.add(emission)
            db.session.commit()
            
            # Update monthly summary
            EmissionService.update_monthly_summary(user_id, emission.date)
            
            return emission
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def update_monthly_summary(user_id, date):
        """Update or create monthly summary for faster queries"""
        try:
            year = date.year
            month = date.month
            
            # Calculate current month totals
            month_start = date.replace(day=1)
            if month == 12:
                next_month = month_start.replace(year=year+1, month=1)
            else:
                next_month = month_start.replace(month=month+1)
            
            # Get emissions for current month grouped by type
            monthly_emissions = db.session.query(
                Emission.emission_type,
                func.sum(Emission.amount).label('total_co2')
            ).filter(
                Emission.user_id == user_id,
                Emission.date >= month_start,
                Emission.date < next_month
            ).group_by(Emission.emission_type).all()
            
            total_emissions = sum(total for _, total in monthly_emissions) or 0.0
            
            # Calculate previous month totals for comparison
            prev_month = month_start - timedelta(days=1)
            prev_month_start = prev_month.replace(day=1)
            
            previous_totals = db.session.query(
                func.sum(Emission.amount)
            ).filter(
                Emission.user_id == user_id,
                Emission.date >= prev_month_start,
                Emission.date < month_start
            ).scalar() or 0.0
            
            # Calculate percentage change
            percent_change = 0.0
            if previous_totals > 0:
                percent_change = ((previous_totals - total_emissions) / previous_totals) * 100
            
            # Get or create monthly summary
            summary = MonthlySummary.query.filter_by(
                user_id=user_id, 
                year=year, 
                month=month
            ).first()
            
            if not summary:
                summary = MonthlySummary(
                    user_id=user_id,
                    year=year,
                    month=month
                )
                db.session.add(summary)
            
            # Update summary data
            summary.total_emissions = total_emissions
            summary.previous_month_emissions = previous_totals
            summary.percent_change = percent_change
            
            # Update category breakdown
            emissions_by_type = {etype: total for etype, total in monthly_emissions}
            summary.electricity_emissions = emissions_by_type.get('electricity', 0.0)
            summary.transport_emissions = emissions_by_type.get('transport', 0.0)
            summary.food_emissions = emissions_by_type.get('food', 0.0)
            summary.other_emissions = total_emissions - (
                summary.electricity_emissions + 
                summary.transport_emissions + 
                summary.food_emissions
            )
            
            summary.updated_at = datetime.utcnow()
            db.session.commit()
            
            return summary
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def get_dashboard_stats(user_id):
        """Get dashboard statistics from monthly summary"""
        try:
            current_date = datetime.now()
            summary = MonthlySummary.query.filter_by(
                user_id=user_id,
                year=current_date.year,
                month=current_date.month
            ).first()
            
            if not summary:
                # Return default values if no data
                return {
                    'total_emissions': 0,
                    'change_percent': 0,
                    'change_type': 'neutral',
                    'period': 'This Month',
                    'message': 'No data available',
                    'category_breakdown': {
                        'electricity': 0,
                        'transport': 0,
                        'food': 0,
                        'other': 0
                    }
                }
            
            return {
                'total_emissions': round(summary.total_emissions, 2),
                'change_percent': round(abs(summary.percent_change), 1),
                'change_type': 'increase' if summary.percent_change > 0 else 'decrease',
                'period': 'This Month',
                'message': 'You\'re reducing emissions!' if summary.percent_change > 0 else 'Emissions increased this month',
                'category_breakdown': {
                    'electricity': round(summary.electricity_emissions, 2),
                    'transport': round(summary.transport_emissions, 2),
                    'food': round(summary.food_emissions, 2),
                    'other': round(summary.other_emissions, 2)
                }
            }
            
        except Exception as e:
            print(f"Error getting dashboard stats: {e}")
            raise e