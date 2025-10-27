import os
import sys
from datetime import datetime, timedelta
import random

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import User, Asset, Activity, Emission, Goal, MonthlySummary

def seed_database():
    """Seed the database with sample data"""
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
            
            # Create sample emissions with emission_type - Generate for last 30 days
            print("🌫️  Creating sample emissions for the last 30 days...")
            emissions_data = []
            
            # Generate emissions for John for the last 30 days
            for day in range(30):
                current_date = datetime.utcnow() - timedelta(days=30 - day)
                
                # Skip some days to make it more realistic (not every day has emissions)
                if random.random() < 0.7:  # 70% chance of having emissions on a given day
                    # Base emissions with some randomness
                    base_emission = random.uniform(10, 40)
                    
                    # Create 1-3 emissions per day
                    num_emissions = random.randint(1, 3)
                    for i in range(num_emissions):
                        emission_type = random.choice(['machine', 'transport', 'electricity'])
                        
                        if emission_type == 'machine':
                            asset = john_assets[0] if john_assets else None
                            activity = 'Construction work'
                            source = 'Excavator'
                            original_value = random.uniform(50, 200)
                            amount = base_emission * random.uniform(0.3, 0.7)
                        elif emission_type == 'transport':
                            asset = random.choice(john_assets[1:]) if len(john_assets) > 1 else None
                            activity = random.choice(['Material delivery', 'Client meetings', 'Site visits'])
                            source = asset.name if asset else 'Vehicle'
                            original_value = random.uniform(30, 150)
                            amount = base_emission * random.uniform(0.2, 0.5)
                        else:  # electricity
                            asset = None
                            activity = 'Office electricity consumption'
                            source = 'Office Electricity'
                            original_value = random.uniform(200, 500)
                            amount = base_emission * random.uniform(0.1, 0.3)
                        
                        emissions_data.append({
                            'user_id': john.id,
                            'asset_id': asset.id if asset else None,
                            'emission_type': emission_type,
                            'activity': activity,
                            'source': source,
                            'original_value': round(original_value, 2),
                            'unit': 'liters' if emission_type == 'machine' else 'km' if emission_type == 'transport' else 'kWh',
                            'amount': round(amount, 2),
                            'calculation_method': 'standard',
                            'emission_factor': round(random.uniform(0.1, 0.3), 3),
                            'date': current_date
                        })
            
            # Generate emissions for Sarah for the last 30 days
            for day in range(30):
                current_date = datetime.utcnow() - timedelta(days=30 - day)
                
                # Sarah has emissions less frequently (more eco-conscious)
                if random.random() < 0.5:  # 50% chance of having emissions
                    base_emission = random.uniform(5, 25)
                    
                    num_emissions = random.randint(1, 2)
                    for i in range(num_emissions):
                        emission_type = random.choice(['transport', 'electricity'])
                        
                        if emission_type == 'transport':
                            # Sarah's Tesla has zero emissions
                            if random.random() < 0.3:  # 30% chance of using Tesla
                                asset = sarah_assets[0] if sarah_assets else None
                                activity = 'Commute to office'
                                source = 'Tesla'
                                original_value = random.uniform(20, 80)
                                amount = 0.0  # Electric vehicle
                            else:
                                asset = sarah_assets[1] if len(sarah_assets) > 1 else None
                                activity = random.choice(['Business trip', 'Generator usage'])
                                source = 'Generator' if asset else 'Business Travel'
                                original_value = random.uniform(10, 50)
                                amount = base_emission * random.uniform(0.4, 0.8)
                        else:  # electricity
                            asset = sarah_assets[1] if len(sarah_assets) > 1 else None
                            activity = 'Office operations'
                            source = 'Generator' if asset and random.random() < 0.4 else 'Grid Electricity'
                            original_value = random.uniform(100, 300)
                            amount = base_emission * random.uniform(0.2, 0.6)
                        
                        emissions_data.append({
                            'user_id': sarah.id,
                            'asset_id': asset.id if asset else None,
                            'emission_type': emission_type,
                            'activity': activity,
                            'source': source,
                            'original_value': round(original_value, 2),
                            'unit': 'km' if emission_type == 'transport' else 'kWh',
                            'amount': round(amount, 2),
                            'calculation_method': 'electric' if source == 'Tesla' else 'standard',
                            'emission_factor': 0.0 if source == 'Tesla' else round(random.uniform(0.1, 0.25), 3),
                            'date': current_date
                        })
            
            # Add the emissions to the database
            for emission_data in emissions_data:
                emission = Emission(**emission_data)
                db.session.add(emission)
            
            db.session.commit()
            print(f"✅ Created {len(emissions_data)} emissions over the last 30 days")
            
            # Create sample activities (recent ones for dashboard)
            print("📊 Creating sample activities...")
            activities_data = []
            
            # Create activities for the last 7 days for both users
            for day in range(7):
                current_date = datetime.utcnow() - timedelta(days=6 - day)
                
                # John's recent activities
                if random.random() < 0.8:
                    activities_data.append({
                        'user_id': john.id,
                        'title': 'Excavator X300',
                        'location': 'Construction Site A',
                        'amount': round(random.uniform(15, 35), 2),
                        'unit': 'kg CO₂',
                        'badge': 'machine',
                        'icon': '🏗️',
                        'date': current_date
                    })
                
                if random.random() < 0.6:
                    activities_data.append({
                        'user_id': john.id,
                        'title': 'Work Truck',
                        'location': 'Material delivery',
                        'amount': round(random.uniform(10, 25), 2),
                        'unit': 'kg CO₂',
                        'badge': 'vehicle',
                        'icon': '🚚',
                        'date': current_date
                    })
                
                # Sarah's recent activities
                if random.random() < 0.5:
                    if random.random() < 0.4:  # Tesla (zero emissions)
                        activities_data.append({
                            'user_id': sarah.id,
                            'title': 'My Tesla Model 3',
                            'location': 'Office commute',
                            'amount': 0.0,
                            'unit': 'kg CO₂',
                            'badge': 'vehicle',
                            'icon': '🚗',
                            'date': current_date
                        })
                    else:  # Generator
                        activities_data.append({
                            'user_id': sarah.id,
                            'title': 'Office Generator',
                            'location': 'Backup power',
                            'amount': round(random.uniform(20, 50), 2),
                            'unit': 'kg CO₂',
                            'badge': 'machine',
                            'icon': '⚡',
                            'date': current_date
                        })
            
            for activity_data in activities_data:
                activity = Activity(**activity_data)
                db.session.add(activity)
            
            db.session.commit()
            print(f"✅ Created {len(activities_data)} recent activities")
            
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
                },
                {
                    'user_id': sarah.id,
                    'title': 'Reduce generator usage by 50%',
                    'target_reduction_percentage': 50,
                    'status': 'completed',
                    'end_date': datetime.utcnow() - timedelta(days=30)
                }
            ]
            
            for goal_data in goals_data:
                goal = Goal(**goal_data)
                db.session.add(goal)
            
            db.session.commit()
            print(f"✅ Created {len(goals_data)} goals")
            
            # Create monthly summaries
            print("📈 Creating monthly summaries...")
            current_date = datetime.utcnow()
            
            # Calculate actual totals from emissions data
            john_current_month_emissions = sum([e.amount for e in Emission.query.filter(
                Emission.user_id == john.id,
                Emission.date >= current_date.replace(day=1)
            ).all()])
            
            john_prev_month_emissions = sum([e.amount for e in Emission.query.filter(
                Emission.user_id == john.id,
                Emission.date >= (current_date.replace(day=1) - timedelta(days=30)),
                Emission.date < current_date.replace(day=1)
            ).all()])
            
            sarah_current_month_emissions = sum([e.amount for e in Emission.query.filter(
                Emission.user_id == sarah.id,
                Emission.date >= current_date.replace(day=1)
            ).all()])
            
            sarah_prev_month_emissions = sum([e.amount for e in Emission.query.filter(
                Emission.user_id == sarah.id,
                Emission.date >= (current_date.replace(day=1) - timedelta(days=30)),
                Emission.date < current_date.replace(day=1)
            ).all()])
            
            monthly_summaries = [
                # Current month for John
                {
                    'user_id': john.id,
                    'year': current_date.year,
                    'month': current_date.month,
                    'total_emissions': round(john_current_month_emissions, 2),
                    'previous_month_emissions': round(john_prev_month_emissions, 2),
                    'percent_change': round(((john_current_month_emissions - john_prev_month_emissions) / john_prev_month_emissions * 100) if john_prev_month_emissions > 0 else 0, 1),
                    'electricity_emissions': round(john_current_month_emissions * 0.3, 2),
                    'transport_emissions': round(john_current_month_emissions * 0.4, 2),
                    'food_emissions': 0.0,
                    'other_emissions': round(john_current_month_emissions * 0.3, 2)
                },
                # Current month for Sarah
                {
                    'user_id': sarah.id,
                    'year': current_date.year,
                    'month': current_date.month,
                    'total_emissions': round(sarah_current_month_emissions, 2),
                    'previous_month_emissions': round(sarah_prev_month_emissions, 2),
                    'percent_change': round(((sarah_current_month_emissions - sarah_prev_month_emissions) / sarah_prev_month_emissions * 100) if sarah_prev_month_emissions > 0 else 0, 1),
                    'electricity_emissions': round(sarah_current_month_emissions * 0.6, 2),
                    'transport_emissions': round(sarah_current_month_emissions * 0.4, 2),
                    'food_emissions': 0.0,
                    'other_emissions': 0.0
                }
            ]
            
            for summary_data in monthly_summaries:
                summary = MonthlySummary(**summary_data)
                db.session.add(summary)
            
            db.session.commit()
            print(f"✅ Created {len(monthly_summaries)} monthly summaries")
            
            # Print summary
            print("\n" + "="*50)
            print("🎉 DATABASE SEEDING COMPLETE!")
            print("="*50)
            print(f"👥 Users: {User.query.count()}")
            print(f"🏗️  Assets: {Asset.query.count()}")
            print(f"📊 Activities: {Activity.query.count()}")
            print(f"🌫️  Emissions: {Emission.query.count()}")
            print(f"🎯 Goals: {Goal.query.count()}")
            print(f"📈 Monthly Summaries: {MonthlySummary.query.count()}")
            print("\n📝 Sample User IDs for testing:")
            print(f"   John Doe: {john.id}")
            print(f"   Sarah Connor: {sarah.id}")
            print("\n📊 Emissions data generated for the last 30 days")
            print("🔑 Default password for all users: password123")
            print("\n🚀 You can now start the server with: python app.py")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding database: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    seed_database()