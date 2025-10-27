import os
import sys
from datetime import datetime, timedelta
import random

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import User, Asset, Activity, Emission, Goal, MonthlySummary

def seed_database():
    """Seed the database with sample data optimized for dashboard charts"""
    with app.app_context():
        try:
            print("🗑️  Clearing existing data...")
            
            # Clear existing data (in reverse order of dependencies)
            Emission.query.delete()
            Activity.query.delete()
            MonthlySummary.query.delete()
            Goal.query.delete()
            Asset.query.delete()
            User.query.delete()
            
            db.session.commit()
            print("✅ Existing data cleared")
            
            # Create sample users
            print("👥 Creating sample users...")
            users = [
                User(
                    name='John Doe',
                    email='john.doe@example.com',
                ),
                User(
                    name='Sarah Connor',
                    email='sarah.connor@example.com', 
                )
            ]
            
            # Set passwords for users
            for user in users:
                user.set_password('password123')
                db.session.add(user)
            
            db.session.commit()
            print(f"✅ Created {len(users)} users")
            
            # Get user IDs
            john = User.query.filter_by(email='john.doe@example.com').first()
            sarah = User.query.filter_by(email='sarah.connor@example.com').first()
            
            # Create sample assets
            print("🏗️  Creating sample assets...")
            assets_data = [
                # John's assets
                {
                    'user_id': john.id,
                    'name': 'Excavator X300',
                    'type': 'machine',
                    'fuel_type': 'diesel',
                    'model': 'CAT 320',
                    'year': '2019',
                    'emoji': '🏗️',
                    'carbon_impact': 15.5
                },
                {
                    'user_id': john.id,
                    'name': 'Work Truck',
                    'type': 'vehicle',
                    'fuel_type': 'diesel',
                    'model': 'Toyota Hilux',
                    'year': '2020',
                    'emoji': '🚚',
                    'carbon_impact': 12.2
                },
                {
                    'user_id': john.id,
                    'name': 'Company Sedan',
                    'type': 'vehicle',
                    'fuel_type': 'petrol',
                    'model': 'Honda Accord',
                    'year': '2021',
                    'emoji': '🚗',
                    'carbon_impact': 8.7
                },
                
                # Sarah's assets
                {
                    'user_id': sarah.id,
                    'name': 'My Tesla Model 3',
                    'type': 'vehicle',
                    'fuel_type': 'electric',
                    'model': 'Tesla Model 3',
                    'year': '2023',
                    'emoji': '🚗',
                    'carbon_impact': 0.0
                },
                {
                    'user_id': sarah.id,
                    'name': 'Office Generator',
                    'type': 'machine',
                    'fuel_type': 'diesel',
                    'model': 'Cummins 5000',
                    'year': '2022',
                    'emoji': '⚡',
                    'carbon_impact': 20.1
                }
            ]
            
            assets = []
            for asset_data in assets_data:
                asset = Asset(**asset_data)
                assets.append(asset)
                db.session.add(asset)
            
            db.session.commit()
            print(f"✅ Created {len(assets)} assets")
            
            # Get assets for reference
            john_assets = Asset.query.filter_by(user_id=john.id).all()
            sarah_assets = Asset.query.filter_by(user_id=sarah.id).all()

            # Create emissions data specifically formatted for the trend chart
            print("📊 Creating emissions data for trend chart...")
            
            # Generate 30 days of emissions data for John
            base_date = datetime.utcnow().replace(hour=12, minute=0, second=0, microsecond=0)
            emissions_data = []
            
            # John's emissions trend - starts high, shows improvement
            for day in range(30):
                date = base_date - timedelta(days=29 - day)  # Last 30 days
                
                # Create a trend: high at start, decreasing over time
                trend_factor = 1.0 - (day / 30) * 0.4  # 40% reduction over period
                daily_total = random.uniform(25, 40) * trend_factor
                
                # Split into multiple emissions per day
                num_emissions = random.randint(2, 4)
                for i in range(num_emissions):
                    if i == 0:  # Machine emission
                        emissions_data.append({
                            'user_id': john.id,
                            'asset_id': john_assets[0].id,
                            'emission_type': 'machine',
                            'activity': f'Construction work day {day+1}',
                            'source': 'Excavator',
                            'original_value': round(random.uniform(80, 150), 2),
                            'unit': 'liters',
                            'amount': round(daily_total * 0.5, 2),
                            'calculation_method': 'standard',
                            'emission_factor': 0.214,
                            'date': date
                        })
                    elif i == 1:  # Transport emission
                        emissions_data.append({
                            'user_id': john.id,
                            'asset_id': john_assets[1].id,
                            'emission_type': 'transport',
                            'activity': f'Material delivery day {day+1}',
                            'source': 'Work Truck',
                            'original_value': round(random.uniform(50, 120), 2),
                            'unit': 'km',
                            'amount': round(daily_total * 0.3, 2),
                            'calculation_method': 'standard',
                            'emission_factor': 0.285,
                            'date': date
                        })
                    else:  # Other emissions
                        emissions_data.append({
                            'user_id': john.id,
                            'emission_type': 'electricity',
                            'activity': f'Office operations day {day+1}',
                            'source': 'Office Electricity',
                            'original_value': round(random.uniform(200, 400), 2),
                            'unit': 'kWh',
                            'amount': round(daily_total * 0.2, 2),
                            'calculation_method': 'standard',
                            'emission_factor': 0.13,
                            'date': date
                        })

            # Sarah's emissions trend - lower and more stable
            for day in range(30):
                date = base_date - timedelta(days=29 - day)
                
                # Sarah has lower, more stable emissions
                daily_total = random.uniform(8, 20)
                
                num_emissions = random.randint(1, 3)
                for i in range(num_emissions):
                    if i == 0 and random.random() < 0.7:  # Electric vehicle (zero emissions)
                        emissions_data.append({
                            'user_id': sarah.id,
                            'asset_id': sarah_assets[0].id,
                            'emission_type': 'transport',
                            'activity': f'Daily commute day {day+1}',
                            'source': 'Tesla',
                            'original_value': round(random.uniform(30, 80), 2),
                            'unit': 'km',
                            'amount': 0.0,
                            'calculation_method': 'electric',
                            'emission_factor': 0.0,
                            'date': date
                        })
                    elif i == 1:  # Generator usage
                        emissions_data.append({
                            'user_id': sarah.id,
                            'asset_id': sarah_assets[1].id,
                            'emission_type': 'electricity',
                            'activity': f'Backup power day {day+1}',
                            'source': 'Generator',
                            'original_value': round(random.uniform(10, 40), 2),
                            'unit': 'liters',
                            'amount': round(daily_total * 0.8, 2),
                            'calculation_method': 'standard',
                            'emission_factor': 1.812,
                            'date': date
                        })
                    else:  # Other
                        emissions_data.append({
                            'user_id': sarah.id,
                            'emission_type': 'transport',
                            'activity': f'Business travel day {day+1}',
                            'source': 'Business Travel',
                            'original_value': round(random.uniform(50, 150), 2),
                            'unit': 'km',
                            'amount': round(daily_total * 0.2, 2),
                            'calculation_method': 'standard',
                            'emission_factor': 0.086,
                            'date': date
                        })

            # Add all emissions to database
            for emission_data in emissions_data:
                emission = Emission(**emission_data)
                db.session.add(emission)
            
            db.session.commit()
            print(f"✅ Created {len(emissions_data)} emissions entries")

            # Create recent activities for dashboard
            print("📝 Creating recent activities...")
            activities_data = []
            
            # Create activities for last 7 days
            for day in range(7):
                date = base_date - timedelta(days=6 - day)
                
                # John's activities
                activities_data.append({
                    'user_id': john.id,
                    'title': 'Excavator X300',
                    'location': 'Downtown Construction Site',
                    'amount': round(random.uniform(15, 35), 2),
                    'unit': 'kg CO₂',
                    'badge': 'machine',
                    'icon': '🏗️',
                    'date': date
                })
                
                if day % 2 == 0:  # Every other day
                    activities_data.append({
                        'user_id': john.id,
                        'title': 'Work Truck',
                        'location': 'Material Delivery Route',
                        'amount': round(random.uniform(10, 25), 2),
                        'unit': 'kg CO₂',
                        'badge': 'vehicle',
                        'icon': '🚚',
                        'date': date
                    })
                
                # Sarah's activities
                if day % 3 == 0:  # Every 3 days
                    activities_data.append({
                        'user_id': sarah.id,
                        'title': 'Office Generator',
                        'location': 'Backup Power Usage',
                        'amount': round(random.uniform(20, 45), 2),
                        'unit': 'kg CO₂',
                        'badge': 'machine',
                        'icon': '⚡',
                        'date': date
                    })
                
                activities_data.append({
                    'user_id': sarah.id,
                    'title': 'My Tesla Model 3',
                    'location': 'Daily Commute',
                    'amount': 0.0,
                    'unit': 'kg CO₂',
                    'badge': 'vehicle',
                    'icon': '🚗',
                    'date': date
                })

            for activity_data in activities_data:
                activity = Activity(**activity_data)
                db.session.add(activity)
            
            db.session.commit()
            print(f"✅ Created {len(activities_data)} activities")

            # Create sample goals
            print("🎯 Creating sample goals...")
            goals_data = [
                {
                    'user_id': john.id,
                    'title': 'Reduce machine emissions by 20%',
                    'target_reduction_percentage': 20,
                    'status': 'active',
                    'end_date': datetime.utcnow() + timedelta(days=90)
                },
                {
                    'user_id': john.id,
                    'title': 'Switch to electric vehicles',
                    'target_reduction_percentage': 35,
                    'status': 'active',
                    'end_date': datetime.utcnow() + timedelta(days=180)
                },
                {
                    'user_id': sarah.id,
                    'title': 'Achieve carbon neutrality',
                    'target_reduction_percentage': 100,
                    'status': 'active',
                    'end_date': datetime.utcnow() + timedelta(days=365)
                }
            ]
            
            for goal_data in goals_data:
                goal = Goal(**goal_data)
                db.session.add(goal)
            
            db.session.commit()
            print(f"✅ Created {len(goals_data)} goals")

            # Create monthly summaries with calculated data
            print("📈 Creating monthly summaries...")
            current_date = datetime.utcnow()
            
            # Calculate actual totals for current month
            john_current_emissions = sum([e.amount for e in Emission.query.filter(
                Emission.user_id == john.id,
                Emission.date >= current_date.replace(day=1)
            ).all()])
            
            sarah_current_emissions = sum([e.amount for e in Emission.query.filter(
                Emission.user_id == sarah.id,
                Emission.date >= current_date.replace(day=1)
            ).all()])
            
            monthly_summaries = [
                {
                    'user_id': john.id,
                    'year': current_date.year,
                    'month': current_date.month,
                    'total_emissions': round(john_current_emissions, 2),
                    'previous_month_emissions': round(john_current_emissions * 1.2, 2),  # 20% higher last month
                    'percent_change': -16.7,
                    'electricity_emissions': round(john_current_emissions * 0.3, 2),
                    'transport_emissions': round(john_current_emissions * 0.4, 2),
                    'food_emissions': 0.0,
                    'other_emissions': round(john_current_emissions * 0.3, 2)
                },
                {
                    'user_id': sarah.id,
                    'year': current_date.year,
                    'month': current_date.month,
                    'total_emissions': round(sarah_current_emissions, 2),
                    'previous_month_emissions': round(sarah_current_emissions * 0.9, 2),  # 10% lower last month
                    'percent_change': 11.1,
                    'electricity_emissions': round(sarah_current_emissions * 0.6, 2),
                    'transport_emissions': round(sarah_current_emissions * 0.4, 2),
                    'food_emissions': 0.0,
                    'other_emissions': 0.0
                }
            ]
            
            for summary_data in monthly_summaries:
                summary = MonthlySummary(**summary_data)
                db.session.add(summary)
            
            db.session.commit()
            print(f"✅ Created {len(monthly_summaries)} monthly summaries")

            # Print debug information
            print("\n" + "="*50)
            print("🎉 DATABASE SEEDING COMPLETE!")
            print("="*50)
            print(f"👥 Users: {User.query.count()}")
            print(f"🏗️  Assets: {Asset.query.count()}")
            print(f"📊 Activities: {Activity.query.count()}")
            print(f"🌫️  Emissions: {Emission.query.count()}")
            print(f"🎯 Goals: {Goal.query.count()}")
            print(f"📈 Monthly Summaries: {MonthlySummary.query.count()}")
            
            # Show sample emissions data for debugging
            john_emissions = Emission.query.filter_by(user_id=john.id).order_by(Emission.date.asc()).all()
            print(f"\n📅 John's emissions date range: {john_emissions[0].date if john_emissions else 'None'} to {john_emissions[-1].date if john_emissions else 'None'}")
            print(f"📊 John's total emissions: {sum(e.amount for e in john_emissions):.2f} kg")
            
            print(f"\n🔑 Default password for all users: password123")
            print("🚀 You can now start the server and check the dashboard!")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding database: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    seed_database()