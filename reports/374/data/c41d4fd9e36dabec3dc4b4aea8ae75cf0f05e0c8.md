# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> visitscotland-dot-com >> visual regression: Outdoor Safety In Scotland
- Location: tests/visual-regression.spec.ts:9:13

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3070/things-to-do/outdoor-activities/outdoor-safety-tips", waiting until "networkidle"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - navigation "Skip to" [ref=e7]:
      - paragraph [ref=e8]: "Skip to:"
      - link "Main menu" [ref=e9] [cursor=pointer]:
        - /url: "#main-nav"
      - link "Search" [ref=e10] [cursor=pointer]:
        - /url: "#site-search-btn"
      - link "Content" [ref=e11] [cursor=pointer]:
        - /url: "#main-heading"
      - link "Footer" [ref=e12] [cursor=pointer]:
        - /url: "#site-footer"
    - banner [ref=e13]:
      - generic [ref=e15]:
        - generic [ref=e17]:
          - generic [ref=e18]: 
          - generic [ref=e20]:
            - paragraph [ref=e22]: "BETA: The search and map are new features with further enhancements planned. VisitScotland is not responsible for the content of external links and accepts no liability for any reliance on these."
            - link "Your feedback will help improve the site" [ref=e24] [cursor=pointer]:
              - /url: https://forms.office.com/Pages/ResponsePage.aspx?id=i6cHlOa1sE2MK35GwX69WtIEyFSgaDlCoMG4KNaUei9URFhFNFhDWFVUQTlRMFBUQ0Y0OTIzQzg2Vi4u
        - button " Close" [ref=e26] [cursor=pointer]:
          - generic: 
          - generic [ref=e27]: Close
    - banner [ref=e29]:
      - generic [ref=e31]:
        - link "VisitScotland Home" [ref=e33] [cursor=pointer]:
          - /url: /
        - text:        
        - generic [ref=e65]:
          - navigation "Utility menu" [ref=e66]:
            - list [ref=e67]:
              - listitem [ref=e68]:
                - link " Search" [ref=e69] [cursor=pointer]:
                  - /url: /site-search-results
                  - generic: 
                  - generic [ref=e70]: Search
              - listitem [ref=e71]:
                - link " My favourites" [ref=e72] [cursor=pointer]:
                  - /url: /favourites
                  - generic: 
                  - generic [ref=e73]: My favourites
              - listitem [ref=e74]:
                - link " Map of Scotland" [ref=e75] [cursor=pointer]:
                  - /url: /map
                  - generic: 
                  - generic [ref=e76]: Map of Scotland
              - listitem [ref=e77]:
                - button "EN " [ref=e79] [cursor=pointer]
          - button " Main menu" [ref=e81] [cursor=pointer]:
            - generic: 
            - generic [ref=e82]: Main menu
    - main [ref=e83]:
      - navigation "breadcrumbs" [ref=e87]:
        - navigation "breadcrumb" [ref=e88]:
          - list [ref=e89]:
            - listitem [ref=e90]:
              - link "Home" [ref=e91] [cursor=pointer]:
                - /url: /
            - listitem [ref=e92]:
              - text: "|"
              - link "Things to do" [ref=e93] [cursor=pointer]:
                - /url: /things-to-do
            - listitem [ref=e94]:
              - text: "|"
              - link "Outdoor Activities" [ref=e95] [cursor=pointer]:
                - /url: /things-to-do/outdoor-activities
            - listitem [ref=e96]:
              - text: "|"
              - generic [ref=e97]: Outdoor Safety Information
      - generic [ref=e99]:
        - generic [ref=e105]:
          - paragraph [ref=e106]: Kayaking with Willowgate Activity Centre in Perth.
          - paragraph [ref=e107]: VisitScotland / Luigi Di Pasquale
        - generic [ref=e109]:
          - heading "Outdoor safety in Scotland" [level=1] [ref=e110]
          - paragraph [ref=e112]: Find peace of mind with our top tips on how to stay safe while holidaying in Scotland.
      - button " Add to your favourites" [ref=e116] [cursor=pointer]:
        - generic: 
        - generic [ref=e117]: Add to your favourites
      - generic [ref=e118]:
        - generic [ref=e121]:
          - heading "Personal safety" [level=2] [ref=e123]
          - generic [ref=e125]:
            - paragraph [ref=e126]: Scotland is a safe and welcoming place to visit. Most personal safety comes down to simple common sense, but a few simple habits can go a long way.
            - figure [ref=e127]:
              - generic [ref=e133]:
                - paragraph [ref=e134]: Bridge of Orchy Train Station
                - paragraph [ref=e135]: © VisitScotland / Luigi Di Pasquale
            - heading "Is Scotland safe to visit?" [level=4] [ref=e136]
            - paragraph [ref=e137]:
              - text: Yes, Scotland is generally a safe and friendly destination. You’ll find that many cities including
              - link "Edinburgh" [ref=e138] [cursor=pointer]:
                - /url: /places-to-go/edinburgh
              - text: ","
              - link "Glasgow" [ref=e139] [cursor=pointer]:
                - /url: /places-to-go/glasgow
              - text: ","
              - link "Aberdeen" [ref=e140] [cursor=pointer]:
                - /url: /places-to-go/aberdeen
              - text: and
              - link "Inverness" [ref=e141] [cursor=pointer]:
                - /url: https://www.visitscotland.com/places-to-go/inverness
              - text: are well-policed. The countryside and the
              - link "Highlands" [ref=e142] [cursor=pointer]:
                - /url: /places-to-go/highlands
              - text: are very safe as long as you use normal travel precautions and plan for changeable weather.
            - heading "Is it safe to walk around Scottish cities like Edinburgh or Glasgow at night?" [level=4] [ref=e143]
            - paragraph [ref=e144]: Yes, especially in central, well-lit areas. As with any city, make sure to stick to well-known city centre locations, keep valuables secure and stay aware of your surroundings.
            - heading "Are there areas I should avoid?" [level=4] [ref=e145]
            - paragraph [ref=e146]: Quieter residential areas and poorly lit side streets are best to avoid late at night, especially if this is your first time visiting Scotland. If there is a street that makes you feel uncomfortable, trust your instincts and take another route. If you’re staying out into the early hours after midnight, it is best to book a taxi after pubs and clubs close.
            - heading "How safe is public transport in Scotland?" [level=4] [ref=e147]
            - paragraph [ref=e148]: Public transport in Scotland is generally safe, reliable, and well used by locals and tourists. Buses, trams and trains operate to a high standard with many major routes, stations and vehicles well-lit at night. You’ll find lots of CCTV and staff present on many services too. Remember to always keep an eye on your personal belongings and sit near other passengers or the driver on buses.
            - figure [ref=e149]:
              - generic [ref=e155]:
                - paragraph [ref=e156]: Passport
                - paragraph
            - heading "Are pickpocketing or scams common in Scotland?" [level=4] [ref=e157]
            - paragraph [ref=e158]: No, pickpocketing and scams are very rare in Scotland. However, places like the Royal Mile in Edinburgh are likely to experience this due to its narrow closes and high density of tourists. If you’re out and about, make sure to keep bags zipped up and valuables secure in crowds and don't leave phones, purses or wallets unattended in cafés, restaurants or pubs. We also recommend using ATMs inside banks and shops if possible.
            - heading "Do I need travel insurance for Scotland?" [level=4] [ref=e159]
            - paragraph [ref=e160]: Although it is not legally required, we recommend taking out travel insurance if you’re a non-UK visitor. This can help cover trip cancellations, delays, lost luggage, personal belongings and outdoor activities which involve added risk, from skiing and snowboarding to hiking and watersports.
            - heading "Are taxi and ride-hailing apps safe to use?" [level=4] [ref=e161]
            - paragraph [ref=e162]:
              - text: Yes. Licensed taxis (black cabs or local private-hire vehicles) and ride-hailing apps like
              - link "Uber " [ref=e163] [cursor=pointer]:
                - /url: https://www.uber.com/gb/en/r/cities/taxi/edinburgh-sct-gb/
                - text: Uber
                - generic: 
              - text: are regulated and safe to use in Scotland. All drivers are vetted and vehicles are inspected regularly. Using official taxi ranks and well-known apps is the safest option, especially at night.
        - generic [ref=e166]:
          - heading "Weather and outdoor safety" [level=2] [ref=e168]
          - generic [ref=e170]:
            - paragraph [ref=e171]: Scotland is known for experiencing four seasons in one day. Make sure you’re prepared and follow these handy tips while outdoors.
            - figure [ref=e172]:
              - generic [ref=e178]:
                - paragraph [ref=e179]: Rainbows over Glen Almond and Lednock Hills near Crieff
                - paragraph
            - heading "How quickly can the weather change in Scotland?" [level=4] [ref=e180]
            - paragraph [ref=e181]: Very quickly. Scotland’s weather can change within minutes, especially in coastal, hill and Highland areas. It’s common to experience sunshine, wind and rain all in one day, so wearing the right clothing and checking the weather forecast before you set off for the day is a must.
            - paragraph [ref=e182]:
              - link "Check out our weather page on what to expect" [ref=e183] [cursor=pointer]:
                - /url: /travel-planning/weather
            - heading "What should I wear for walking and hiking?" [level=4] [ref=e184]
            - paragraph [ref=e185]: Lots of warm layers. We recommend wearing a waterproof jacket and trousers, hat, scarf or balaclava, gloves, thick wooly socks and sturdy hiking boots with a good grip.
            - heading "What should I pack in my backpack if I’m planning a walking holiday?" [level=4] [ref=e186]
            - paragraph [ref=e187]: Pack comfortable walking shoes, layers, and a waterproof jacket in case the weather changes. Bring water, snacks, your phone and a small essentials kit filled with plasters, sunscreen and a charger.
            - figure [ref=e188]:
              - generic [ref=e194]:
                - paragraph [ref=e195]: Walking in the Pentland Hills
                - paragraph
            - heading "Is it safe to go hiking alone?" [level=4] [ref=e196]
            - paragraph [ref=e197]: Solo hiking is usually fine if you stick to well-marked popular routes such as the Pentland Hills in Edinburgh, paths along Loch Lomond & The Trossachs and low-level trails across the Cairngorm area. However, it can become risky in remote areas if the weather takes a turn for the worse.
            - paragraph [ref=e198]: Before you set off, always tell someone your route and when you plan to return from your hike.
            - paragraph [ref=e199]:
              - link "Go on a walking holiday in Scotland" [ref=e200] [cursor=pointer]:
                - /url: /things-to-do/outdoor-activities/walking
            - heading "What should I know about winter driving conditions?" [level=4] [ref=e201]
            - paragraph [ref=e202]: During winter, black ice is common and often visible on bridges and roads. If bad weather is expected, many major roads and motorways across Scotland are usually gritted and cleared first. However, please be mindful that rural routes and side roads may take some time to clear.
            - paragraph [ref=e203]:
              - link "Check live gritting and road conditions via the Traffic Scotland website " [ref=e204] [cursor=pointer]:
                - /url: https://www.traffic.gov.scot/gritter-tracker
                - text: Check live gritting and road conditions via the Traffic Scotland website
                - generic: 
            - heading "Are there risks from strong winds or storms?" [level=4] [ref=e205]
            - paragraph [ref=e206]: Yes, strong winds and storms are a regular occurrence in Scotland, especially during autumn and winter. They can cause bridge restrictions, ferry and train cancellations, fallen trees, power cuts and dangerous conditions on roads and in exposed outdoor areas.
            - paragraph [ref=e207]:
              - text: Keep an eye out on the
              - link "Met Office " [ref=e208] [cursor=pointer]:
                - /url: https://weather.metoffice.gov.uk/warnings-and-advice/uk-warnings
                - text: Met Office
                - generic: 
              - text: website for yellow, amber and red warnings during unsettled weather. During amber or red warnings, it’s best to avoid unnecessary travel to help you stay safe.
        - generic [ref=e211]:
          - heading "Water and coastal safety" [level=2] [ref=e213]
          - generic [ref=e215]:
            - paragraph [ref=e216]: The crisp sea waters and calm lochs across Scotland are often enticing for a dip or swim, especially on a warm day. Whilst wild swimming in Scotland is allowed, there is some outdoor safety advice you should follow.
            - figure [ref=e217]:
              - generic [ref=e223]:
                - paragraph [ref=e224]: Wild swimming in the Cairngorms
                - paragraph
            - heading "Is wild swimming safe in Scotland?" [level=4] [ref=e225]
            - paragraph [ref=e226]: Yes, but it is never risk-free. Make sure to check out the weather, tides, and local advice beforehand. After heavy rainfall, the water quality can change very quickly, leading to the growth of blue-green algae which can cause illness or skin irritation. To help you stay safe, we recommend not swimming after it rains or if the water has a strong odour.
            - heading "How cold is the water?" [level=4] [ref=e227]
            - paragraph [ref=e228]: The water is cold all year round in Scotland. In summer, the average temperature is between 10-15°C and even much colder in winter.
            - heading "What are the health risks of wild swimming or cold water?" [level=4] [ref=e229]
            - paragraph [ref=e230]: Cold water shock is the biggest risk when it comes to wild swimming. This can affect anyone, regardless of fitness and strength. Sudden gasping, uncontrollable breathing, and a rapid heartbeat are just some of the symptoms that appear and can be life-threatening.
            - heading "Can beginners try wild swimming?" [level=4] [ref=e231]
            - paragraph [ref=e232]: Yes, beginners are welcome to try wild swimming in Scotland. Just remember to take it easy with short dips and to ease yourself into the water slowly to avoid cold water shock.
            - figure [ref=e233]:
              - generic [ref=e239]:
                - paragraph [ref=e240]: Wild Swimming at Arbirlot Falls, Arbroath
                - paragraph [ref=e241]: © VisitScotland / Kate Abbey
            - heading "Is it safe to swim alone?" [level=4] [ref=e242]
            - paragraph [ref=e243]: No, we do not recommend wild swimming alone as this can increase the risk of serious incidents. Make sure to bring a pal or go with a local swim group.
            - heading "What should I wear/bring for going wild swimming?" [level=4] [ref=e244]
            - paragraph [ref=e245]: "We recommend the following items if you’re planning to go wild swimming in Scotland:"
            - list [ref=e246]:
              - listitem [ref=e247]: • Bright swim cap
              - listitem [ref=e248]: • Tow float (to help you stay visible while out in the water)
              - listitem [ref=e249]: • Wetsuit
              - listitem [ref=e250]: • Warm clothing
              - listitem [ref=e251]: • A hot beverage in a flask
            - heading "How long should I stay in the water?" [level=4] [ref=e252]
            - paragraph [ref=e253]: Beginners should only be in the water for a maximum of 5 minutes. Once you feel more confident in the water, you can gradually build up your time over multiple swims. Get out immediately if you ever feel numb, dizzy or out of breath.
            - paragraph [ref=e254]:
              - link "Check out wild swimming spots in Scotland" [ref=e255] [cursor=pointer]:
                - /url: /things-to-do/outdoor-activities/wild-swimming-locations
        - generic [ref=e258]:
          - heading "Wildlife and environmental risks" [level=2] [ref=e260]
          - generic [ref=e262]:
            - paragraph [ref=e263]: Scotland’s wildlife is generally harmless but make sure you’re dressed appropriately for the weather and don’t go too far off the beaten track.
            - figure [ref=e264]:
              - generic [ref=e270]:
                - paragraph [ref=e271]: Highland cows at Aikenshill House
                - paragraph [ref=e272]: © North East 250 / Damian Shields
            - heading "Are there dangerous animals in Scotland?" [level=4] [ref=e273]
            - paragraph [ref=e274]: The good news is that you don't need to worry about any dangerous animals in Scotland. You won't run into any deadly wildlife while you're here. You might come across midges, ticks and the odd jellyfish in the sea, but they are mostly harmless. Neither wild nor farm animals pose a threat, as long as you don't approach them too closely and use basic common sense while around livestock.
            - paragraph [ref=e275]:
              - link "Discover different species of wildlife you can find in Scotland" [ref=e276] [cursor=pointer]:
                - /url: /things-to-do/landscapes-nature/wildlife
            - heading "Is bird flu a risk to people visiting Scotland?" [level=4] [ref=e277]
            - paragraph [ref=e278]: No, bird flu mainly affects birds, not people. The risk to human health is very low, but we strongly advise not to touch or pick up any sick or dead birds and to keep dogs on a lead in affected areas.
            - paragraph [ref=e279]:
              - link "Visit the NatureScot website for more information on bird flu " [ref=e280] [cursor=pointer]:
                - /url: https://www.nature.scot/doc/avian-influenza-bird-flu
                - text: Visit the NatureScot website for more information on bird flu
                - generic: 
            - heading "Can you catch diseases from animals in Scotland?" [level=4] [ref=e281]
            - paragraph [ref=e282]: Whilst it's relatively uncommon for animals in Scotland to pass on diseases, it is strongly recommended to wash your hands after any visits to petting zoos or farms to minimise the risk.
            - heading "Are midges harmful?" [level=4] [ref=e283]
            - paragraph [ref=e284]: No, they don’t carry diseases and they won’t make you ill. At worst, their bites can be itchy or irritating.
            - heading "What are ticks and how do I avoid tick bites?" [level=4] [ref=e285]
            - paragraph [ref=e286]: Ticks are tiny, spider-like insects that live in grassy, wooded areas. Their bites are usually painless, but some can transmit Lyme disease, which is treatable if caught early.
            - paragraph [ref=e287]: To avoid ticks, stick to paths, cover up by wearing long sleeves and trousers, use insect repellent and check your skin and clothes after being outdoors. If you’re bringing your pets on holiday, you may want to check them also as they can bring ticks inside.
            - paragraph [ref=e288]:
              - link "Read our guide to midges and ticks in Scotland" [ref=e289] [cursor=pointer]:
                - /url: /travel-planning/midges-ticks-scotland
            - heading "How serious is Lyme disease?" [level=4] [ref=e290]
            - paragraph [ref=e291]: If left untreated, Lyme disease can lead to long-term health issues which can include joint pain, nerve issues, fatigue, or heart problems.
            - heading "What is the Scottish Outdoor Access Code?" [level=4] [ref=e292]
            - paragraph [ref=e293]: The Code is a set of simple rules that explain your rights and responsibilities when enjoying the outdoors in Scotland. Thanks to the Land Reform (Scotland) Act 2003 you have the right to explore most of the country’s land and water.
            - paragraph [ref=e294]: This applies to hills, moors, forests, beaches, woods, rivers and some farmland, and gives you the right to walk, cycle, climb, swim, watch wildlife and more.
            - paragraph [ref=e295]: "It works on three key principles:"
            - list [ref=e296]:
              - listitem [ref=e297]: • Respecting others
              - listitem [ref=e298]: • Caring for the environment
              - listitem [ref=e299]: • Taking responsibility for your actions
            - paragraph [ref=e300]:
              - link "Become a responsible tourist by following the Scottish Outdoor Access Code " [ref=e301] [cursor=pointer]:
                - /url: https://www.outdooraccess-scotland.scot/act-and-access-code/scottish-outdoor-access-code-visitors-and-land-managers/what-scottish-outdoor-access-code
                - text: Become a responsible tourist by following the Scottish Outdoor Access Code
                - generic: 
            - figure [ref=e302]:
              - generic [ref=e308]:
                - paragraph [ref=e309]: Glenshee Camping, Perthshire
                - paragraph [ref=e310]: © VisitScotland / Kate Abbey
            - heading "Is it safe to camp or light fires outdoors?" [level=4] [ref=e311]
            - paragraph [ref=e312]: Yes, however please take extra precautions when lighting fires outdoors. Please don’t light bonfires and avoid using disposable barbecues if possible. If you must, ensure it’s not in contact with grass or flammable surfaces and safely dispose of all your litter afterwards.
            - heading "Is it safe to drink water from rivers, streams and burns in Scotland?" [level=4] [ref=e313]
            - paragraph [ref=e314]: Visitors are advised not to drink water directly from rivers, streams or burns. While the water may appear pristine, natural water sources can contain bacteria or other contaminants that might not be visible. Any water taken from natural sources should be boiled before drinking to help prevent illness.
            - paragraph [ref=e315]:
              - text: Tap water in Scotland is safe to drink and other safe drinking sources such as
              - link "Scottish Water drinking fountains " [ref=e316] [cursor=pointer]:
                - /url: https://www.yourwateryourlife.co.uk/find-my-nearest-tap/
                - text: Scottish Water drinking fountains
                - generic: 
              - text: can be used, as well as bottled water.
            - paragraph [ref=e317]: Walkers and campers are encouraged to plan ahead and carry enough drinking water for their journey, especially on long-distance walking routes where shops and refill points may be limited or unavailable. In these cases, water purification tablets may also be use.
            - heading "What should I do if I see a fire?" [level=4] [ref=e318]
            - paragraph [ref=e319]: If you see a wildfire, it’s important to find a safe place immediately away from the fire, smoke, and nearby vegetation. Afterwards, call 999 and ask for the Fire Service. Reporting a wildfire early will help protect people, wildlife and Scotland’s landscapes.
            - heading "When is the risk of forest fires the highest in Scotland?" [level=4] [ref=e320]
            - paragraph [ref=e321]: The risk of forest fires is highest in spring, especially from March to May. This can also rise again during hot, dry spells in summer.
            - heading "Is outdoor toileting allowed in Scotland?" [level=4] [ref=e322]
            - paragraph [ref=e323]: Yes. However, make sure you do so properly as failure to dispose of human waste can lead to contaminating the water and crops, infecting livestock and ultimately take the fun out of hillwalking and camping.
            - paragraph [ref=e324]:
              - link "Find out more information on outdoor toileting in Scotland " [ref=e325] [cursor=pointer]:
                - /url: https://www.mountaineering.scot/safety-and-skills/health-and-hygiene/outdoor-toileting
                - text: Find out more information on outdoor toileting in Scotland
                - generic: 
            - heading "What is the Scottish Fossil Code?" [level=4] [ref=e326]
            - paragraph [ref=e327]: The Scottish Fossil Code is a simple guide to enjoying fossil hunting responsibly across Scotland, home to some of the world’s most important fossil discoveries. It helps protect these sites by encouraging safe, respectful collection, so fossils and landscapes are preserved for the future.
            - paragraph [ref=e328]:
              - link "Find out more about the Scottish Fossil Code on the NatureScot website " [ref=e329] [cursor=pointer]:
                - /url: https://www.nature.scot/doc/scottish-fossil-code-1
                - text: Find out more about the Scottish Fossil Code on the NatureScot website
                - generic: 
            - heading "Is it safe to eat wild foods in Scotland?" [level=4] [ref=e330]
            - paragraph [ref=e331]: Yes, eating wild foods in Scotland can be safe and enjoyable as long as you know what you’re picking. If you’re ever unsure, don’t eat it!
            - paragraph [ref=e332]:
              - link "Check out more information on foraging on the NatureScot website " [ref=e333] [cursor=pointer]:
                - /url: https://www.nature.scot/professional-advice/social-and-economic-benefits-nature/food-and-drink/foraging
                - text: Check out more information on foraging on the NatureScot website
                - generic: 
            - heading "Can I drink alcohol in outdoor public places?" [level=4] [ref=e334]
            - paragraph [ref=e335]: You can drink alcohol outdoors in Scotland, but some towns and city centres may not allow it. If there are signs saying no public drinking, don’t risk it. If you’re ever in doubt, always stick to licensed places like beer gardens or festival zones with permits.
        - generic [ref=e338]:
          - heading "Road and transport safety" [level=2] [ref=e340]
          - generic [ref=e342]:
            - paragraph [ref=e343]: Whether you’re in the passenger seat or behind the wheel, Scotland’s roads are easily accessible to get you from A to B in no time. Make sure to always wear a seatbelt, follow speed limits, and stay alert on narrow roads to help you enjoy the ride better.
            - figure [ref=e344]:
              - generic [ref=e350]:
                - paragraph [ref=e351]: Isle of Mull
                - paragraph [ref=e352]: © VisitScotland / Frida Berg
            - heading "Is driving in Scotland difficult for visitors?" [level=4] [ref=e353]
            - paragraph [ref=e354]: Driving in Scotland is generally easy for visitors. Just keep in mind that we drive on the left-hand side and take your time on narrow country roads.
            - heading "What should I know about single-track roads?" [level=4] [ref=e355]
            - paragraph [ref=e356]: Single-track roads are narrow country roads, so drivers politely take turns using passing places to let each other through. Drive slowly, be patient and pull in when needed with a friendly wave or flash of headlights to let the other driver know you’ve seen them and are giving way. Please remember to also not park in passing places.
            - heading "Is it safe to drive in remote areas?" [level=4] [ref=e357]
            - paragraph [ref=e358]: Yes, just be mindful that country roads are narrower. During your travels, you might not come across as many shops and fuel stations enroute. Always drive at a relaxed pace, plan fuel stops in advance and watch out for wildlife as deer, sheep and cattle can appear suddenly.
            - heading "Do I need winter tyres or special equipment to drive in Scotland?" [level=4] [ref=e359]
            - paragraph [ref=e360]: Generally, no. In winter, they can be helpful in the Highlands or during snow and ice, but they’re not essential. Just remember to take care while driving and be prepared with warm clothing, a charged phone and extra fuel if heading into remote areas.
            - heading "Who do I contact if I break down in a remote area?" [level=4] [ref=e361]
            - paragraph [ref=e362]: Call your breakdown provider first (e.g. the AA, RAC or Green Flag) if you have cover. If you don’t have cover, call a local recovery service. If you happen to break down in a remote area, the police can sometimes arrange for recovery.
            - paragraph [ref=e363]:
              - link "Find out more about driving in Scotland" [ref=e364] [cursor=pointer]:
                - /url: /travel-planning/driving
            - paragraph [ref=e365]
        - generic [ref=e368]:
          - heading "Cycling safety" [level=2] [ref=e370]
          - generic [ref=e372]:
            - paragraph [ref=e373]: Get ready to pedal your way around Scotland and find out how to cycle safely and more confidently.
            - figure [ref=e374]:
              - generic [ref=e380]:
                - paragraph [ref=e381]: The Kelvin Aqueduct in Glasgow
                - paragraph [ref=e382]: © VisitScotland
            - heading "Is Scotland safe for cycling?" [level=4] [ref=e383]
            - paragraph [ref=e384]: Yes, Scotland is mostly safe for cycling, especially in our cities with a growing number of cycle lanes. However, safety can depend on location and weather conditions.
            - paragraph [ref=e385]: Rural roads can be narrow while wet weather and short winter daylight hours can make cycling harder. Good visibility is key when planning a cycling trip in Scotland so make sure to prioritise route planning.
            - heading "Is bike theft common in Scotland?" [level=4] [ref=e386]
            - paragraph [ref=e387]: Yes, bike theft does happen, but it’s more common in busy urban areas than in smaller towns. Making sure to use a good-quality lock, securing your bike to a solid, well-lit stand or keeping it indoors overnight will greatly reduce the risk of your bike being stolen.
            - heading "What equipment do I need for cycling?" [level=4] [ref=e388]
            - paragraph [ref=e389]: To get you started cycling, you’ll need a bike that suits your riding, a helmet for safety, and front and rear lights so you can be seen by others. Wear comfortable clothes and sturdy shoes, carry water and use a lock to protect your bike. Extras like a pump, puncture kit, and high visibility gear also make rides easier and safer.
            - heading "What should I wear when cycling in Scotland?" [level=4] [ref=e390]
            - paragraph [ref=e391]: Wear comfortable, breathable clothing, a light waterproof or windproof jacket, and layers you can add or remove as the temperature changes. Always wear bright and reflective clothing, wear a helmet and in colder weather, wear gloves and water-resistant shoes to stay warm.
            - figure [ref=e392]:
              - generic [ref=e398]:
                - paragraph [ref=e399]: Cycling at Dundee Waterfront
                - paragraph [ref=e400]: © VisitScotland / Kenny Lam
            - heading "Are there dedicated cycle paths?" [level=4] [ref=e401]
            - paragraph [ref=e402]:
              - text: Yes, you’ll find many dedicated cycle paths across Scotland’s towns and cities. Many areas also have separate cycle lanes and the
              - link "National Cycle Network " [ref=e403] [cursor=pointer]:
                - /url: https://www.walkwheelcycletrust.org.uk/national-cycle-network/
                - text: National Cycle Network
                - generic: 
              - text: ", which provides traffic-free paths and quieter routes linking cities, towns and the countryside for an epic cycling adventure."
            - heading "Is it safe to cycle on roads?" [level=4] [ref=e404]
            - paragraph [ref=e405]: Yes, however make sure you have working lights, wear high-visibility gear and choose quieter routes to avoid congestion across Scotland's major roads.
            - heading "Are there wildlife and environmental hazards?" [level=4] [ref=e406]
            - paragraph [ref=e407]: Yes, especially when cycling in rural parts of Scotland. You may encounter animals like deer or sheep on the road, uneven surfaces, potholes, or gravel, particularly on quieter roads and trails. Weather is also a big risk with rain, wind and ice causing poor visibility, which can make cycling more challenging. Wearing the right gear and riding carefully will help keep your journeys comfortable and safe.
            - paragraph [ref=e408]:
              - link "Find out more about cycling in Scotland" [ref=e409] [cursor=pointer]:
                - /url: /things-to-do/outdoor-activities/cycling
        - generic [ref=e412]:
          - heading "Snowsports and mountains" [level=2] [ref=e414]
          - generic [ref=e416]:
            - paragraph [ref=e417]: Hitting the slopes for a skiing holiday in Scotland is a great way to unwind. Just make sure you’re prepared for the weather and follow all key guidance.
            - figure [ref=e418]:
              - generic [ref=e424]:
                - paragraph [ref=e425]: Skier at Cairngorm Mountain
                - paragraph
            - heading "Is skiing or snowboarding in Scotland safe?" [level=4] [ref=e426]
            - paragraph [ref=e427]: Yes, Scotland’s ski centres are well run, with patrolled slopes, marked runs and safety staff. Weather conditions on the slopes can change quickly, so make sure to dress warmly, check forecasts, stick to open runs and follow local guidance.
            - heading "Where can I check snow and weather conditions?" [level=4] [ref=e428]
            - paragraph [ref=e429]:
              - text: Check our
              - link "skiing and snowboarding " [ref=e430] [cursor=pointer]:
                - /url: /things-to-do/outdoor-activities/skiing-snowsports
                - text: skiing and snowboarding
                - generic: 
              - text: page for up to date snow reports. Use the
              - link "Met Office " [ref=e431] [cursor=pointer]:
                - /url: https://www.metoffice.gov.uk/
                - text: Met Office
                - generic: 
              - text: or
              - link "Mountain Weather Information Service " [ref=e432] [cursor=pointer]:
                - /url: https://www.mwis.org.uk/
                - text: Mountain Weather Information Service
                - generic: 
              - text: (MWIS), and
              - link "SAIS " [ref=e433] [cursor=pointer]:
                - /url: https://www.sais.gov.uk/
                - text: SAIS
                - generic: 
              - text: for avalanche conditions in winter.
            - heading "Are avalanches a risk in Scotland?" [level=4] [ref=e434]
            - paragraph [ref=e435]:
              - text: Yes, especially during the winter in areas like the
              - link "Cairngorms" [ref=e436] [cursor=pointer]:
                - /url: /places-to-go/national-parks/cairngorms
              - text: ","
              - link "Glencoe" [ref=e437] [cursor=pointer]:
                - /url: /places-to-go/glencoe
              - text: and
              - link "Ben Nevis" [ref=e438] [cursor=pointer]:
                - /url: /things-to-do/outdoor-activities/walking/mountains-hills/ben-nevis
              - text: . Before you head out, always check the Scottish Avalanche Information Service reports and stick to marked, open areas or guided routes.
            - heading "Do I need specialist equipment or guides?" [level=4] [ref=e439]
            - paragraph [ref=e440]: If you’re using marked, open ski slopes at Scottish ski centres, you don’t need specialist equipment or a guide. However, you will need specialist gear and a guide for off-piste skiing, ski touring and mountain routes, especially in winter when there is risk of avalanches.
      - generic:     
      - generic [ref=e441]:
        - heading "Other things you might like" [level=2] [ref=e449]
        - generic [ref=e455]:
          - generic [ref=e459]:
            - button "Previous slide" [disabled]:
              - generic: 
              - generic: previous
            - button "Next slide" [ref=e460] [cursor=pointer]:
              - generic: 
              - generic [ref=e461]: next
          - generic [ref=e463]:
            - group "Slide 1 of 6" [ref=e464]:
              - generic [ref=e465]:
                - generic [ref=e466]:
                  - figure [ref=e467]
                  - paragraph [ref=e469]:
                    - generic [ref=e470]: Travel & planning
                - heading [level=3] [ref=e472]:
                  - link "Top tips for travelling to Scotland " [ref=e473] [cursor=pointer]:
                    - /url: /travel-planning
                    - text: Top tips for travelling to Scotland
                    - generic: 
            - group "Slide 2 of 6" [ref=e474]:
              - generic [ref=e475]:
                - generic [ref=e476]:
                  - figure [ref=e477]
                  - paragraph [ref=e479]:
                    - generic [ref=e480]: Travel & planning
                - heading [level=3] [ref=e482]:
                  - link "Sustainable & responsible tourism in Scotland " [ref=e483] [cursor=pointer]:
                    - /url: /travel-planning/responsible-tourism
                    - text: Sustainable & responsible tourism in Scotland
                    - generic: 
            - group "Slide 3 of 6" [ref=e484]:
              - generic [ref=e485]:
                - generic [ref=e486]:
                  - figure [ref=e487]
                  - paragraph [ref=e489]:
                    - generic [ref=e490]: Things to do
                - heading [level=3] [ref=e492]:
                  - link "Fun outdoor activities in Scotland " [ref=e493] [cursor=pointer]:
                    - /url: /things-to-do/outdoor-activities
                    - text: Fun outdoor activities in Scotland
                    - generic: 
            - group "Slide 4 of 6" [ref=e494]:
              - generic [ref=e495]:
                - generic [ref=e496]:
                  - figure [ref=e497]
                  - paragraph [ref=e499]:
                    - generic [ref=e500]: Travel & planning
                - heading [level=3] [ref=e502]:
                  - link "Frequently asked questions about Scotland " [ref=e503] [cursor=pointer]:
                    - /url: /travel-planning/scotland-faqs
                    - text: Frequently asked questions about Scotland
                    - generic: 
            - group "Slide 5 of 6" [ref=e504]:
              - generic [ref=e505]:
                - generic [ref=e506]:
                  - figure [ref=e507]
                  - paragraph [ref=e509]:
                    - generic [ref=e510]: Things to do
                - heading [level=3] [ref=e512]:
                  - link "Scotland's landscapes and nature " [ref=e513] [cursor=pointer]:
                    - /url: /things-to-do/landscapes-nature
                    - text: Scotland's landscapes and nature
                    - generic: 
            - group "Slide 6 of 6" [ref=e514]:
              - generic [ref=e515]:
                - generic [ref=e516]:
                  - figure [ref=e517]
                  - paragraph [ref=e519]:
                    - generic [ref=e520]: Things to do
                - heading [level=3] [ref=e522]:
                  - link "Watersports in Scotland " [ref=e523] [cursor=pointer]:
                    - /url: /things-to-do/outdoor-activities/watersports
                    - text: Watersports in Scotland
                    - generic: 
      - generic [ref=e530]:
        - generic [ref=e531]:
          - heading "Join our Newsletter Clan" [level=2] [ref=e532]
          - paragraph [ref=e534]: Get Scotland inspiration direct to your inbox. Don't miss the inside track from our Scotland experts on exciting trip ideas, unique attractions and hidden gems loved by locals.
        - link "Get the Scotland newsletter" [ref=e536] [cursor=pointer]:
          - /url: /newsletter
    - contentinfo [ref=e538]:
      - generic [ref=e542]:
        - generic [ref=e544]:
          - generic [ref=e545]:
            - text: 
            - heading "Visitor information" [level=2] [ref=e546]
          - menu [ref=e548]:
            - menuitem [ref=e549]:
              - link "Test Data" [ref=e550] [cursor=pointer]:
                - /url: /test
            - menuitem [ref=e551]:
              - link "Accommodation" [ref=e552] [cursor=pointer]:
                - /url: /sandbox
        - generic [ref=e554]:
          - generic [ref=e555]:
            - text: 
            - heading "Get in touch" [level=2] [ref=e556]
          - menu [ref=e558]:
            - menuitem [ref=e559]:
              - link "Contact us" [ref=e560] [cursor=pointer]:
                - /url: /contact-us
            - menuitem [ref=e561]:
              - link "Feedback & Complaints " [ref=e562] [cursor=pointer]:
                - /url: https://www.visitscotland.org/about-us/our-policies/complaints-feedback
                - text: Feedback & Complaints
                - generic: 
            - menuitem [ref=e563]:
              - link "Submit an event" [ref=e564] [cursor=pointer]:
                - /url: /things-to-do/events/submit-event
        - generic [ref=e566]:
          - generic [ref=e567]:
            - text: 
            - heading "Our other sites" [level=2] [ref=e568]
          - menu [ref=e570]:
            - menuitem [ref=e571]:
              - link "Business Events " [ref=e572] [cursor=pointer]:
                - /url: https://businessevents.visitscotland.com/
                - text: Business Events
                - generic: 
            - menuitem [ref=e573]:
              - link "Business Support Hub " [ref=e574] [cursor=pointer]:
                - /url: https://support.visitscotland.org/
                - text: Business Support Hub
                - generic: 
            - menuitem [ref=e575]:
              - link "Travel Trade " [ref=e576] [cursor=pointer]:
                - /url: https://traveltrade.visitscotland.org/
                - text: Travel Trade
                - generic: 
            - menuitem [ref=e577]:
              - link "Asset library " [ref=e578] [cursor=pointer]:
                - /url: https://visitscotland.canto.global/v/visitscotlandassetlibrary
                - text: Asset library
                - generic: 
            - menuitem [ref=e579]:
              - link "Corporate " [ref=e580] [cursor=pointer]:
                - /url: https://www.visitscotland.org/
                - text: Corporate
                - generic: 
            - menuitem [ref=e581]:
              - link "Brand Scotland " [ref=e582] [cursor=pointer]:
                - /url: https://www.scotland.org/
                - text: Brand Scotland
                - generic: 
        - generic [ref=e584]:
          - heading "Find us on" [level=2] [ref=e585]
          - list [ref=e586]:
            - listitem [ref=e587]:
              - link "fab fa-youtube" [ref=e588] [cursor=pointer]:
                - /url: https://www.youtube.com/channel/UC1FdvQG5MFwzv0PY6dMsaFg
                - generic: 
                - text: 
            - listitem [ref=e589]:
              - link "fab fa-x-twitter" [ref=e590] [cursor=pointer]:
                - /url: https://twitter.com/VisitScotland
                - generic: 
                - text: 
            - listitem [ref=e591]:
              - link "fab fa-facebook" [ref=e592] [cursor=pointer]:
                - /url: https://www.facebook.com/visitscotland/
                - generic: 
                - text: 
            - listitem [ref=e593]:
              - link "fab fa-instagram" [ref=e594] [cursor=pointer]:
                - /url: https://www.instagram.com/visitscotland/
                - generic: 
                - text: 
      - generic:        
      - menu [ref=e599]:
        - menuitem [ref=e600]:
          - link "About us " [ref=e601] [cursor=pointer]:
            - /url: https://www.visitscotland.org/what-we-do
            - text: About us
            - generic: 
        - menuitem [ref=e602]:
          - link "Accessibility" [ref=e603] [cursor=pointer]:
            - /url: /policies/accessibility
        - menuitem [ref=e604]:
          - link "Acceptable use" [ref=e605] [cursor=pointer]:
            - /url: /policies/acceptable-use
        - menuitem [ref=e606]:
          - link "Cookies" [ref=e607] [cursor=pointer]:
            - /url: /policies/privacy/cookies
        - menuitem [ref=e608]:
          - link "Environmental policy" [ref=e609] [cursor=pointer]:
            - /url: /policies/environmental
        - menuitem [ref=e610]:
          - link "Privacy " [ref=e611] [cursor=pointer]:
            - /url: https://www.visitscotland.org/what-we-do/privacy-centre
            - text: Privacy
            - generic: 
        - menuitem [ref=e612]:
          - link "Social media" [ref=e613] [cursor=pointer]:
            - /url: /policies/terms-conditions/social-media
        - menuitem [ref=e614]:
          - link "Terms of use" [ref=e615] [cursor=pointer]:
            - /url: /policies/terms-conditions
      - generic [ref=e619]:
        - link "Brand Scotland":
          - /url: https://www.scotland.org/
        - paragraph [ref=e621]: © 2026 VisitScotland. All rights reserved.
  - generic [ref=e622]:
    - button "Toggle Nuxt DevTools" [ref=e623] [cursor=pointer]
    - generic "App load time" [ref=e627]:
      - generic [ref=e628]: "3"
      - generic [ref=e629]: s
    - button "Toggle Component Inspector" [ref=e631] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { resolve } from 'path';
  3  | import { apps } from './pages.config';
  4  | import { mockBloomreachApi, waitForHydration } from './utils/mock-bloomreach';
  5  | 
  6  | for (const app of apps) {
  7  |     test.describe(app.name, () => {
  8  |         for (const page of app.pages) {
  9  |             test(`visual regression: ${page.name}`, async ({ page: browserPage }, testInfo) => {
  10 |                 test.skip(testInfo.project.name !== app.name, 'Skipping: not the current project');
  11 | 
  12 |                 const fixturePath = resolve(
  13 |                     process.cwd(),
  14 |                     app.fixtureDir,
  15 |                     page.fixtureFile,
  16 |                 );
  17 | 
  18 |                 await mockBloomreachApi(browserPage, {
  19 |                     endpoint: app.bloomreachEndpoint,
  20 |                     fixturePath,
  21 |                 });
  22 | 
  23 |                 await browserPage.route('**/api/getEndpoint', (route) =>
  24 |                     route.fulfill({
  25 |                         status: 200,
  26 |                         contentType: 'text/plain',
  27 |                         body: `https://${app.bloomreachEndpoint}/resourceapi`,
  28 |                     }),
  29 |                 );
  30 |                 await browserPage.route('**/api/getXForwardedHost', (route) =>
  31 |                     route.fulfill({
  32 |                         status: 200,
  33 |                         contentType: 'text/plain',
  34 |                         body: '',
  35 |                     }),
  36 |                 );
  37 | 
> 38 |                 await browserPage.goto(page.path, { waitUntil: 'networkidle' });
     |                                   ^ Error: page.goto: Test timeout of 60000ms exceeded.
  39 | 
  40 |                 await waitForHydration(browserPage);
  41 | 
  42 |                 await expect(browserPage).toHaveScreenshot(
  43 |                     `${page.name.toLowerCase().replace(/\s+/g, '-')}.png`,
  44 |                     { fullPage: true },
  45 |                 );
  46 |             });
  47 |         }
  48 |     });
  49 | }
  50 | 
```