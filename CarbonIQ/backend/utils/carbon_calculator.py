"""
Carbon Calculator Utility
Calculates CO2 emissions for various activities based on standard emission factors
"""

# Emission factors (kg CO2 per unit)
EMISSION_FACTORS = {
    # Transportation (kg CO2 per km)
    'transport': {
        'car_petrol': 0.192,      # Average petrol car
        'car_diesel': 0.171,      # Average diesel car
        'car_electric': 0.053,    # Electric car (grid average)
        'car_hybrid': 0.109,      # Hybrid car
        'motorcycle': 0.113,      # Average motorcycle
        'bus': 0.089,             # Public bus per passenger
        'train': 0.041,           # Train per passenger
        'plane_short': 0.255,     # Short-haul flight per passenger
        'plane_long': 0.195,      # Long-haul flight per passenger
        'bicycle': 0.0,           # Zero emissions
        'walking': 0.0,           # Zero emissions
    },
    
    # Energy (kg CO2 per kWh)
    'energy': {
        'electricity_grid': 0.385,    # Grid average
        'electricity_coal': 0.820,    # Coal power
        'electricity_gas': 0.490,     # Natural gas
        'electricity_renewable': 0.0, # Solar/wind
        'natural_gas': 0.185,         # Per kWh
        'heating_oil': 0.265,         # Per liter
    },
    
    # Food (kg CO2 per kg)
    'food': {
        'beef': 27.0,
        'lamb': 39.2,
        'pork': 12.1,
        'chicken': 6.9,
        'fish': 6.1,
        'eggs': 4.8,
        'cheese': 13.5,
        'milk': 1.9,          # Per liter
        'rice': 2.7,
        'vegetables': 0.4,
        'fruits': 0.5,
    },
    
    # Waste (kg CO2 per kg)
    'waste': {
        'general_waste': 0.5,
        'recycling': 0.02,
        'compost': 0.01,
    },
    
    # Other
    'other': {
        'water': 0.0003,      # Per liter
        'paper': 1.3,         # Per kg
        'plastic': 6.0,       # Per kg
    }
}


class CarbonCalculator:
    """Calculate carbon emissions for various activities"""
    
    @staticmethod
    def calculate_transport_emission(distance_km, vehicle_type='car_petrol'):
        """
        Calculate emissions from transportation
        
        Args:
            distance_km (float): Distance traveled in kilometers
            vehicle_type (str): Type of vehicle (e.g., 'car_petrol', 'bus', 'plane_short')
        
        Returns:
            dict: {
                'amount': float (kg CO2),
                'factor': float (emission factor used),
                'calculation': str (description of calculation)
            }
        """
        factor = EMISSION_FACTORS['transport'].get(vehicle_type, 0.192)
        amount = distance_km * factor
        
        return {
            'amount': round(amount, 2),
            'factor': factor,
            'calculation': f"{distance_km} km × {factor} kg CO₂/km",
            'unit': 'kg CO₂'
        }
    
    @staticmethod
    def calculate_energy_emission(energy_kwh, energy_source='electricity_grid'):
        """
        Calculate emissions from energy consumption
        
        Args:
            energy_kwh (float): Energy consumed in kWh
            energy_source (str): Type of energy source
        
        Returns:
            dict: Emission calculation details
        """
        factor = EMISSION_FACTORS['energy'].get(energy_source, 0.385)
        amount = energy_kwh * factor
        
        return {
            'amount': round(amount, 2),
            'factor': factor,
            'calculation': f"{energy_kwh} kWh × {factor} kg CO₂/kWh",
            'unit': 'kg CO₂'
        }
    
    @staticmethod
    def calculate_food_emission(weight_kg, food_type='chicken'):
        """
        Calculate emissions from food consumption
        
        Args:
            weight_kg (float): Weight of food in kg
            food_type (str): Type of food
        
        Returns:
            dict: Emission calculation details
        """
        factor = EMISSION_FACTORS['food'].get(food_type, 5.0)
        amount = weight_kg * factor
        
        return {
            'amount': round(amount, 2),
            'factor': factor,
            'calculation': f"{weight_kg} kg × {factor} kg CO₂/kg",
            'unit': 'kg CO₂'
        }
    
    @staticmethod
    def calculate_waste_emission(weight_kg, waste_type='general_waste'):
        """
        Calculate emissions from waste
        
        Args:
            weight_kg (float): Weight of waste in kg
            waste_type (str): Type of waste
        
        Returns:
            dict: Emission calculation details
        """
        factor = EMISSION_FACTORS['waste'].get(waste_type, 0.5)
        amount = weight_kg * factor
        
        return {
            'amount': round(amount, 2),
            'factor': factor,
            'calculation': f"{weight_kg} kg × {factor} kg CO₂/kg",
            'unit': 'kg CO₂'
        }
    
    @staticmethod
    def calculate_custom_emission(value, emission_factor):
        """
        Calculate emissions using a custom factor
        
        Args:
            value (float): Input value
            emission_factor (float): Custom emission factor
        
        Returns:
            dict: Emission calculation details
        """
        amount = value * emission_factor
        
        return {
            'amount': round(amount, 2),
            'factor': emission_factor,
            'calculation': f"{value} × {emission_factor} kg CO₂",
            'unit': 'kg CO₂'
        }
    
    @staticmethod
    def get_available_categories():
        """Get all available emission categories and their types"""
        return {
            'transport': list(EMISSION_FACTORS['transport'].keys()),
            'energy': list(EMISSION_FACTORS['energy'].keys()),
            'food': list(EMISSION_FACTORS['food'].keys()),
            'waste': list(EMISSION_FACTORS['waste'].keys()),
            'other': list(EMISSION_FACTORS['other'].keys())
        }
    
    @staticmethod
    def get_emission_factor(category, type_name):
        """Get emission factor for a specific category and type"""
        return EMISSION_FACTORS.get(category, {}).get(type_name, 0.0)


# Convenience functions
def calculate_car_trip(distance_km, fuel_type='petrol'):
    """Quick calculation for car trips"""
    vehicle_type = f'car_{fuel_type}'
    return CarbonCalculator.calculate_transport_emission(distance_km, vehicle_type)


def calculate_flight(distance_km, flight_type='short'):
    """Quick calculation for flights"""
    vehicle_type = f'plane_{flight_type}'
    return CarbonCalculator.calculate_transport_emission(distance_km, vehicle_type)


def calculate_electricity_usage(kwh, source='grid'):
    """Quick calculation for electricity"""
    energy_source = f'electricity_{source}'
    return CarbonCalculator.calculate_energy_emission(kwh, energy_source)
