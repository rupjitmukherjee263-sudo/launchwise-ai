SAMPLE_CASES = {
    "bangalore_cafe": {
        "title": "Artisanal Single-Origin Specialty Coffee Bar",
        "description": "A high-focus, single-estate pour-over and espresso bar offering transparent farm-to-cup traceability, silent acoustic workspace zones, and artisanal plant-based pastries in Indiranagar, Bengaluru.",
        "category": "Food & Beverage / Specialty Retail",
        "country": "India",
        "city_region": "Indiranagar, Bengaluru",
        "target_demographic": "Tech founders, software engineers, and remote design professionals aged 23-40 with disposable monthly income > INR 90,000.",
        "intended_price": 280.0,
        "estimated_cost": 72.0,
        "startup_budget": 2400000.0,
        "monthly_expenses": 280000.0,
        "target_monthly_sales": 2200,
        "distribution_channel": "hybrid",
        "business_model": "B2C / Walk-in & Corporate Pantry Subscription",
        "usp": "Exclusive direct-trade micro-lot coffee beans from Chikmagalur estates paired with acoustically treated, ergonomic deep-work booths.",
        "founder_resources": "Certified Q-Grader head barista with 6 years experience in Sydney and Bengaluru specialty coffee roasting.",
        "competitors": [
            {
                "name": "Third Wave Coffee",
                "category": "direct",
                "location": "12th Main Rd, Indiranagar, Bengaluru",
                "address": "724, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
                "latitude": 12.9719,
                "longitude": 77.6412,
                "source_url": "https://www.thirdwavecoffeeroasters.com",
                "pricing_summary": "INR 240 - 360 per beverage",
                "est_price": 270.0,
                "strengths": ["Strong national brand presence", "High pedestrian footfall", "Extensive loyalty mobile app"],
                "weaknesses": ["Frequently crowded and noisy", "Inconsistent extraction quality during peak rush", "Industrialized pastry selection"],
                "offerings": ["Espresso drinks", "Manual brews", "Sandwiches", "Packaged beans"],
                "market_gaps": ["Quiet focus workspace zones", "Estate-traceable micro-lots with farmer profile cards"],
                "is_verified": True,
                "verification_source": "Google Maps & Field Audit"
            },
            {
                "name": "Blue Tokai Coffee Roasters",
                "category": "direct",
                "location": "100 Feet Rd, Indiranagar, Bengaluru",
                "address": "583, 100 Feet Rd, Defence Colony, Indiranagar, Bengaluru, Karnataka 560038",
                "latitude": 12.9754,
                "longitude": 77.6445,
                "source_url": "https://bluetokaicoffee.com",
                "pricing_summary": "INR 230 - 340 per beverage",
                "est_price": 260.0,
                "strengths": ["Pioneer in Indian specialty coffee", "Superior bean sourcing network", "Sourdough bakery partnership with Suchali's"],
                "weaknesses": ["Limited seating capacity", "Long wait times during weekend brunch", "Minimal acoustic treatment for calls"],
                "offerings": ["Pour-overs", "Aeropress", "Cold brew cans", "Artisan bakery"],
                "market_gaps": ["Corporate workspace packages", "Barista-led sensory cupping masterclasses"],
                "is_verified": True,
                "verification_source": "Google Maps & Public Menu"
            },
            {
                "name": "Starbucks Coffee",
                "category": "indirect",
                "location": "100 Feet Rd, Indiranagar, Bengaluru",
                "address": "100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
                "latitude": 12.9768,
                "longitude": 77.6439,
                "source_url": "https://www.starbucks.in",
                "pricing_summary": "INR 310 - 450 per beverage",
                "est_price": 340.0,
                "strengths": ["Global brand trust", "Plentiful seating and air conditioning", "Reliable WiFi"],
                "weaknesses": ["Dark dark-roasted commodity profile", "High sugar formulations", "Expensive value-to-quality ratio"],
                "offerings": ["Frappuccinos", "Flavored lattes", "Packaged snacks"],
                "market_gaps": ["Authentic specialty single-origin tasting profiles", "Local neighborhood community vibe"],
                "is_verified": True,
                "verification_source": "Public Directory"
            },
            {
                "name": "Araku Coffee",
                "category": "direct",
                "location": "12th Main Rd, Indiranagar, Bengaluru",
                "address": "968, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
                "latitude": 12.9702,
                "longitude": 77.6421,
                "source_url": "https://arakucoffee.in",
                "pricing_summary": "INR 350 - 550 per beverage",
                "est_price": 380.0,
                "strengths": ["Luxury architectural design", "Award-winning international biodynamic coffee", "Full gourmet culinary menu"],
                "weaknesses": ["Intimidating luxury pricing for daily consumption", "Valet congestion"],
                "offerings": ["Specialty siphon brew", "Gourmet plates", "Signature mocktails"],
                "market_gaps": ["Accessible daily regular pricing (INR 240-280 tier)", "Grab-and-go morning corporate commuter service"],
                "is_verified": True,
                "verification_source": "Field Inspection & Website"
            }
        ],
        "personas": [
            {
                "name": "Arjun - Senior Product Architect",
                "demographics": "Age 31, Lives in Indiranagar, Works remotely at a Series-B fintech startup. Annual compensation INR 45 Lakhs.",
                "core_problems": [
                    "Current cafes are too loud for zoom meetings and complex coding tasks",
                    "Commodity coffee gives jittery caffeine crashes due to over-roasting",
                    "Frustrated by poor WiFi and unavailable power outlets"
                ],
                "purchasing_motivations": [
                    "High-grade clean extraction coffee that boosts sustained mental focus",
                    "Acoustically dampened booths with reliable gigabit WiFi and ergonomic seating",
                    "Frictionless contactless mobile ordering to skip queue"
                ],
                "budget_sensitivity": "Low",
                "preferred_channels": ["Direct walk-in", "Pre-order web app", "Weekend subscription bean pickup"],
                "rejection_reasons": ["Loud blender noise near seating", "Unreliable internet speed < 50 Mbps"],
                "is_observed": True,
                "sample_quote": "I spend 4 hours in cafes daily. If a spot has great pour-overs, quiet booths, and fast WiFi, I will happily spend INR 600 every single morning."
            },
            {
                "name": "Pooja - Creative Agency Director",
                "demographics": "Age 28, Lives in HAL Stage 2, Runs a boutique brand design studio. Frequent client meetings.",
                "core_problems": [
                    "Generic coffee chains lack design aesthetic to impress high-value enterprise clients",
                    "Lack of vegan/oat-milk options that don't taste synthetic"
                ],
                "purchasing_motivations": [
                    "Visually striking minimalist interiors and curated ceramic tableware",
                    "Single-origin coffees with rich flavor notes (jasmine, stone fruit, bergamot)",
                    "Plant-based clean pastry pairings without refined sugars"
                ],
                "budget_sensitivity": "Moderate",
                "preferred_channels": ["Instagram booking", "Curated tasting events", "Walk-in"],
                "rejection_reasons": ["Disorganized service or unkempt tables", "Unskilled barista with milk overheating"],
                "is_observed": True,
                "sample_quote": "The space you host clients in speaks volumes about your standards. I need a cafe that treats coffee like fine wine."
            }
        ]
    },
    "mumbai_kombucha": {
        "title": "Raw Organic Functional Kombucha & Wellness Elixirs",
        "description": "Small-batch glass-bottled probiotic raw kombucha brewed with indigenous Himalayan green teas and cold-pressed cold-chain botanicals for gut health, distributed across premium fitness gyms and organic grocers in Bandra and Juhu, Mumbai.",
        "category": "Health Food & Functional Beverage",
        "country": "India",
        "city_region": "Bandra West, Mumbai",
        "target_demographic": "Health-conscious urban consumers, pilates and crossfit members, corporate executives aged 24-45 with monthly wellness budgets > INR 15,000.",
        "intended_price": 190.0,
        "estimated_cost": 48.0,
        "startup_budget": 1600000.0,
        "monthly_expenses": 190000.0,
        "target_monthly_sales": 2600,
        "distribution_channel": "hybrid",
        "business_model": "D2C Online & B2B Premium Retail",
        "usp": "100% cold-chain raw unpasteurized probiotic culture with under 3g natural sugar per bottle, sweetened only with raw monk fruit.",
        "founder_resources": "Biochemist with 5 years fermentation R&D and established distribution connections across 18 high-end Mumbai gyms.",
        "competitors": [
            {
                "name": "Atmosphere Kombucha",
                "category": "direct",
                "location": "Bandra West, Mumbai",
                "address": "Distribution across Nature's Basket and Foodhall, Bandra, Mumbai",
                "latitude": 19.0596,
                "longitude": 72.8295,
                "source_url": "https://atmospherewellness.com",
                "pricing_summary": "INR 200 - 240 per 330ml bottle",
                "est_price": 220.0,
                "strengths": ["First-mover brand recognition", "Aesthetic pastel packaging", "Pan-India presence"],
                "weaknesses": ["High sugar content (6-8g) in popular fruit flavours", "Ambient temperature shipping risk"],
                "offerings": ["Classic kombucha", "Kombucha gummy treats", "Fermented condiments"],
                "market_gaps": ["Ultra-low glycemic / monk fruit formulations", "Gym-specific post-workout recovery elixirs"],
                "is_verified": True,
                "verification_source": "Supermarket Audit & Lab Testing"
            },
            {
                "name": "Raw Pressery Cold Pressed Juices",
                "category": "indirect",
                "location": "Bandra Kurla Complex & Bandra West, Mumbai",
                "address": "Available at all quick-commerce platforms (Blinkit, Zepto, Instamart)",
                "latitude": 19.0657,
                "longitude": 72.8688,
                "source_url": "https://www.rawpressery.com",
                "pricing_summary": "INR 120 - 180 per bottle",
                "est_price": 150.0,
                "strengths": ["Mass distribution via Blinkit/Zepto with 10-minute delivery", "Huge marketing budgets"],
                "weaknesses": ["Not fermented (zero probiotics)", "High natural fructose calories"],
                "offerings": ["Cold-pressed juices", "Almond milks", "Smoothies"],
                "market_gaps": ["Living gut microbiome support and natural digestive enzymes"],
                "is_verified": True,
                "verification_source": "Retail Catalog"
            }
        ],
        "personas": [
            {
                "name": "Meera - Pilates Studio Instructor & Wellness Influencer",
                "demographics": "Age 27, Lives in Pali Hill Bandra, 35k Instagram followers, passionate about functional medicine.",
                "core_problems": [
                    "Most commercial bottled beverages contain hidden refined sugars or artificial preservatives",
                    "Struggles to find truly raw, live-culture probiotic drinks that preserve active enzymes"
                ],
                "purchasing_motivations": [
                    "Strict nutritional transparency with batch lab testing certificates",
                    "Monk-fruit natural sweetening without insulin spikes",
                    "Eco-friendly glass return-and-refill deposit program"
                ],
                "budget_sensitivity": "Low",
                "preferred_channels": ["Direct D2C weekly milk-style doorstep delivery", "Gym reception cooler"],
                "rejection_reasons": ["Plastic packaging", "Pasteurized shelf-stable claims (which kill live cultures)"],
                "is_observed": True,
                "sample_quote": "If a brand gives me authentic, cold-shipped live kombucha that fits my macros, I will recommend it to all my 120 studio clients."
            }
        ]
    }
}
