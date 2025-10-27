import os
import sys
from datetime import datetime, timedelta
from sqlalchemy import func

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
                    username='john_doe',
                    email='john.doe@example.com',
                    company_name='Construction Co',
                    industry='Construction'
                ),
                User(
                    username='sarah_connor',
                    email='sarah.connor@example.com',
                    company_name='Tech Solutions',
                    industry='Technology'
                )
            ]
            
            for user in users:
                db.session.add(user)
            
            db.session.commit()
            print(f"✅ Created {len(users)} users")
            
            # Get user IDs
            john = User.query.filter_by(username='john_doe').first()
            sarah = User.query.filter_by(username='sarah_connor').first()
            
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
            
            # Create sample activities
            print("📊 Creating sample activities...")
            activities_data = [
                # John's activities
                {
                    'user_id': john.id,
                    'title': 'Excavator X300',
                    'location': 'Construction Site A - Downtown Project',
                    'amount': 32.16,
                    'unit': 'kg CO2',
                    'badge': 'machine',
                    'icon': '🏗️',
                    'date': datetime.utcnow() - timedelta(days=2)
                },
                {
                    'user_id': john.id,
                    'title': 'Work Truck',
                    'location': 'Office to Industrial Park delivery',
                    'amount': 22.78,
                    'unit': 'kg CO2',
                    'badge': 'vehicle',
                    'icon': '🚚',
                    'date': datetime.utcnow() - timedelta(days=1)
                },
                {
                    'user_id': john.id,
                    'title': 'Company Sedan',
                    'location': 'Client meetings across town',
                    'amount': 14.20,
                    'unit': 'kg CO2',
                    'badge': 'vehicle',
                    'icon': '🚗',
                    'date': datetime.utcnow()
                },
                
                # Sarah's activities
                {
                    'user_id': sarah.id,
                    'title': 'My Tesla Model 3',
                    'location': '3 times to Downtown offices',
                    'amount': 0.0,
                    'unit': 'kg CO2',
                    'badge': 'vehicle',
                    'icon': '🚗',
                    'date': datetime.utcnow() - timedelta(days=3)
                },
                {
                    'user_id': sarah.id,
                    'title': 'Office Generator',
                    'location': 'Backup power during outage',
                    'amount': 45.30,
                    'unit': 'kg CO2',
                    'badge': 'machine',
                    'icon': '⚡',
                    'date': datetime.utcnow() - timedelta(days=1)
                }
            ]
            
            for activity_data in activities_data:
                activity = Activity(**activity_data)
                db.session.add(activity)
            
            db.session.commit()
            print(f"✅ Created {len(activities_data)} activities")
            
            # Create sample emissions
            print("🌫️  Creating sample emissions...")
            emissions_data = [
                # Current month emissions for John
                {
                    'user_id': john.id,
                    'amount': 32.16,
                    'source': 'Excavator',
                    'emission_type': 'machine',
                    'date': datetime.utcnow() - timedelta(days=2)
                },
                {
                    'user_id': john.id,
                    'amount': 22.78,
                    'source': 'Work Truck',
                    'emission_type': 'transport',
                    'date': datetime.utcnow() - timedelta(days=1)
                },
                {
                    'user_id': john.id,
                    'amount': 14.20,
                    'source': 'Company Car',
                    'emission_type': 'transport',
                    'date': datetime.utcnow()
                },
                {
                    'user_id': john.id,
                    'amount': 45.50,
                    'source': 'Office Electricity',
                    'emission_type': 'electricity',
                    'date': datetime.utcnow() - timedelta(days=5)
                },
                
                # Previous month emissions for John (for comparison)
                {
                    'user_id': john.id,
                    'amount': 28.45,
                    'source': 'Excavator',
                    'emission_type': 'machine',
                    'date': datetime.utcnow() - timedelta(days=35)
                },
                {
                    'user_id': john.id,
                    'amount': 18.90,
                    'source': 'Work Truck',
                    'emission_type': 'transport',
                    'date': datetime.utcnow() - timedelta(days=32)
                },
                
                # Sarah's emissions
                {
                    'user_id': sarah.id,
                    'amount': 0.0,
                    'source': 'Tesla',
                    'emission_type': 'transport',
                    'date': datetime.utcnow() - timedelta(days=3)
                },
                {
                    'user_id': sarah.id,
                    'amount': 45.30,
                    'source': 'Generator',
                    'emission_type': 'electricity',
                    'date': datetime.utcnow() - timedelta(days=1)
                },
                {
                    'user_id': sarah.id,
                    'amount': 25.75,
                    'source': 'Business Travel',
                    'emission_type': 'transport',
                    'date': datetime.utcnow() - timedelta(days=4)
                }
            ]
            
            for emission_data in emissions_data:
                emission = Emission(**emission_data)
                db.session.add(emission)
            
            db.session.commit()
            print(f"✅ Created {len(emissions_data)} emissions")
            
            # Create sample goals
            print("🎯 Creating sample goals...")
            goals_data = [
                {
                    'user_id': john.id,
                    'title': 'Reduce machine emissions by 20%',
                    'target_reduction_percentage': 20,
                    'status': 'active',
                    'deadline': datetime.utcnow() + timedelta(days=90)
                },
                {
                    'user_id': john.id,
                    'title': 'Switch to electric vehicles',
                    'target_reduction_percentage': 35,
                    'status': 'active',
                    'deadline': datetime.utcnow() + timedelta(days=180)
                },
                {
                    'user_id': sarah.id,
                    'title': 'Achieve carbon neutrality',
                    'target_reduction_percentage': 100,
                    'status': 'active',
                    'deadline': datetime.utcnow() + timedelta(days=365)
                },
                {
                    'user_id': sarah.id,
                    'title': 'Reduce generator usage by 50%',
                    'target_reduction_percentage': 50,
                    'status': 'completed',
                    'deadline': datetime.utcnow() - timedelta(days=30)
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
            monthly_summaries = [
                # Current month for John
                {
                    'user_id': john.id,
                    'year': current_date.year,
                    'month': current_date.month,
                    'total_emissions': 114.64,  # Sum of current month emissions
                    'electricity_emissions': 45.50,
                    'transport_emissions': 36.98,
                    'food_emissions': 0.0,
                    'other_emissions': 32.16
                },
                # Previous month for John
                {
                    'user_id': john.id,
                    'year': (current_date - timedelta(days=35)).year,
                    'month': (current_date - timedelta(days=35)).month,
                    'total_emissions': 47.35,  # Sum of previous month emissions
                    'electricity_emissions': 0.0,
                    'transport_emissions': 18.90,
                    'food_emissions': 0.0,
                    'other_emissions': 28.45
                },
                # Current month for Sarah
                {
                    'user_id': sarah.id,
                    'year': current_date.year,
                    'month': current_date.month,
                    'total_emissions': 71.05,
                    'electricity_emissions': 45.30,
                    'transport_emissions': 25.75,
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
            print("\n🚀 You can now start the server with: python app.py")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding database: {str(e)}")
            raise

if __name__ == '__main__':
    seed_database()