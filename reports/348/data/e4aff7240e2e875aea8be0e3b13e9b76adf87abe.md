# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> visitscotland-dot-com >> visual regression: Homepage
- Location: tests/visual-regression.spec.ts:9:13

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1280px by 7694px, received 1280px by 13888px. 4960062 pixels (ratio 0.28 of all image pixels) are different.

  Snapshot: homepage.png

Call log:
  - Expect "toHaveScreenshot(homepage.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 7694px, received 1280px by 13888px. 4959984 pixels (ratio 0.28 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1280px by 7694px, received 1280px by 13888px. 4960062 pixels (ratio 0.28 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e7]:
      - navigation "Skip to" [ref=e8]:
        - paragraph [ref=e9]: "Skip to:"
        - link "Main menu" [ref=e10] [cursor=pointer]:
          - /url: "#main-nav"
        - link "Content" [ref=e11] [cursor=pointer]:
          - /url: "#main-heading"
        - link "Footer" [ref=e12] [cursor=pointer]:
          - /url: "#site-footer"
      - banner [ref=e13]:
        - navigation [ref=e14]:
          - generic [ref=e17]:
            - link " My favourites" [ref=e18] [cursor=pointer]:
              - /url: /favourites
              - generic: 
              - generic [ref=e19]: My favourites
            - generic:
              - text:  
              - menu " LanguageEN " [ref=e20]:
                - menuitem " Language" [ref=e21]:
                  - generic: 
                  - text: Language
                - menuitem "English" [ref=e22] [cursor=pointer]
                - menuitem "Español" [ref=e23] [cursor=pointer]
                - menuitem "Italiano" [ref=e24] [cursor=pointer]
                - menuitem "Deutsch" [ref=e25] [cursor=pointer]
                - menuitem "Nederlands" [ref=e26] [cursor=pointer]
                - menuitem "Français" [ref=e27] [cursor=pointer]
            - menu [ref=e29]:
              - menuitem " Language" [ref=e30]:
                - generic: 
                - text: Language
              - menuitem "English" [ref=e31] [cursor=pointer]
              - menuitem "Español" [ref=e32] [cursor=pointer]
              - menuitem "Italiano" [ref=e33] [cursor=pointer]
              - menuitem "Deutsch" [ref=e34] [cursor=pointer]
              - menuitem "Nederlands" [ref=e35] [cursor=pointer]
              - menuitem "Français" [ref=e36] [cursor=pointer]
        - generic [ref=e37]:
          - navigation "main nav" [ref=e38]:
            - generic [ref=e40]:
              - link "Visit Scotland Home" [ref=e43] [cursor=pointer]:
                - /url: /
                - generic [ref=e44]: Visit Scotland Home
              - menubar [ref=e46]:
                - menuitem "Places to go" [ref=e47]:
                  - button "Places to go" [ref=e48] [cursor=pointer]
                  - menu [ref=e49]:
                    - menuitem "All Places to go vsMeganavCities vsMeganavPopularPlaces vsMeganavTowns vsMeganavIslands vsMeganavRegions" [ref=e50]:
                      - generic [ref=e53]:
                        - link "All Places to go" [ref=e54] [cursor=pointer]:
                          - /url: /places-to-go
                        - separator [ref=e55]
                        - generic [ref=e56]:
                          - navigation "vsMeganavCities" [ref=e57]:
                            - heading "Cities" [level=2] [ref=e58]
                            - menu [ref=e59]:
                              - menuitem "All Cities" [ref=e60] [cursor=pointer]
                              - menuitem "Aberdeen" [ref=e61] [cursor=pointer]
                              - menuitem "Dundee" [ref=e62] [cursor=pointer]
                              - menuitem "Dunfermline" [ref=e63] [cursor=pointer]
                              - menuitem "Edinburgh" [ref=e64] [cursor=pointer]
                              - menuitem "Glasgow" [ref=e65] [cursor=pointer]
                              - menuitem "Inverness" [ref=e66] [cursor=pointer]
                              - menuitem "Perth" [ref=e67] [cursor=pointer]
                              - menuitem "Stirling" [ref=e68] [cursor=pointer]
                          - navigation "vsMeganavPopularPlaces" [ref=e69]:
                            - heading "Popular Places" [level=2] [ref=e70]
                            - menu [ref=e71]:
                              - menuitem "Ben Nevis" [ref=e72] [cursor=pointer]
                              - menuitem "Glencoe" [ref=e73] [cursor=pointer]
                              - menuitem "Loch Lomond" [ref=e74] [cursor=pointer]
                              - menuitem "Loch Ness" [ref=e75] [cursor=pointer]
                          - navigation "vsMeganavTowns" [ref=e76]:
                            - heading "Towns" [level=2] [ref=e77]
                            - menu [ref=e78]:
                              - menuitem "All Towns" [ref=e79] [cursor=pointer]
                              - menuitem "Aviemore" [ref=e80] [cursor=pointer]
                              - menuitem "Dumfries" [ref=e81] [cursor=pointer]
                              - menuitem "Fort William" [ref=e82] [cursor=pointer]
                              - menuitem "Kirkwall" [ref=e83] [cursor=pointer]
                              - menuitem "Lerwick" [ref=e84] [cursor=pointer]
                              - menuitem "Oban" [ref=e85] [cursor=pointer]
                              - menuitem "Peebles" [ref=e86] [cursor=pointer]
                              - menuitem "Pitlochry" [ref=e87] [cursor=pointer]
                              - menuitem "St Andrews" [ref=e88] [cursor=pointer]
                          - navigation "vsMeganavIslands" [ref=e89]:
                            - heading "Islands" [level=2] [ref=e90]
                            - menu [ref=e91]:
                              - menuitem "All Islands" [ref=e92] [cursor=pointer]
                              - menuitem "Isle of Arran" [ref=e93] [cursor=pointer]
                              - menuitem "Isle of Islay" [ref=e94] [cursor=pointer]
                              - menuitem "Jura" [ref=e95] [cursor=pointer]
                              - menuitem "Lewis & Harris" [ref=e96] [cursor=pointer]
                              - menuitem "Mull" [ref=e97] [cursor=pointer]
                              - menuitem "Orkney" [ref=e98] [cursor=pointer]
                              - menuitem "Outer Hebrides" [ref=e99] [cursor=pointer]
                              - menuitem "Shetland" [ref=e100] [cursor=pointer]
                              - menuitem "Skye" [ref=e101] [cursor=pointer]
                          - navigation "vsMeganavRegions" [ref=e102]:
                            - heading "Regions" [level=2] [ref=e103]
                            - menu [ref=e104]:
                              - menuitem "Aberdeen & Aberdeenshire" [ref=e105] [cursor=pointer]
                              - menuitem "Argyll & The Isles" [ref=e106] [cursor=pointer]
                              - menuitem "Ayrshire & Arran" [ref=e107] [cursor=pointer]
                              - menuitem "Dumfries & Galloway" [ref=e108] [cursor=pointer]
                              - menuitem "Dundee & Angus" [ref=e109] [cursor=pointer]
                              - menuitem "Edinburgh & The Lothians" [ref=e110] [cursor=pointer]
                              - menuitem "Fife" [ref=e111] [cursor=pointer]
                              - menuitem "Glasgow & Clyde Valley" [ref=e112] [cursor=pointer]
                              - menuitem "Loch Lomond, Trossachs, Stirling & Forth Valley" [ref=e113] [cursor=pointer]
                              - menuitem "Highlands" [ref=e114] [cursor=pointer]
                              - menuitem "Perthshire" [ref=e115] [cursor=pointer]
                              - menuitem "Scottish Borders" [ref=e116] [cursor=pointer]
                        - text: 
                - menuitem "Things to do" [ref=e117]:
                  - button "Things to do" [ref=e118] [cursor=pointer]
                  - menu [ref=e119]:
                    - menuitem "All Things to do vsMeganavAttractions vsMeganavOutdoorActivities vsMeganavFoodDrink vsMeganavLandscapesNature vsMeganavToursRoutesTrails vsMeganavEvents" [ref=e120]:
                      - generic [ref=e123]:
                        - link "All Things to do" [ref=e124] [cursor=pointer]:
                          - /url: /things-to-do
                        - separator [ref=e125]
                        - generic [ref=e126]:
                          - navigation "vsMeganavAttractions" [ref=e127]:
                            - heading "Attractions" [level=2] [ref=e128]
                            - menu [ref=e129]:
                              - menuitem "All Attractions" [ref=e130] [cursor=pointer]
                              - menuitem "20 Top Attractions" [ref=e131] [cursor=pointer]
                              - menuitem "Ancestry" [ref=e132] [cursor=pointer]
                              - menuitem "Arts & Culture" [ref=e133] [cursor=pointer]
                              - menuitem "Castles" [ref=e134] [cursor=pointer]
                              - menuitem "Free Attractions" [ref=e135] [cursor=pointer]
                              - menuitem "History & Heritage" [ref=e136] [cursor=pointer]
                              - menuitem "TV & Film Locations" [ref=e137] [cursor=pointer]
                          - navigation "vsMeganavOutdoorActivities" [ref=e138]:
                            - heading "Outdoor Activities" [level=2] [ref=e139]
                            - menu [ref=e140]:
                              - menuitem "All Outdoor Activities" [ref=e141] [cursor=pointer]
                              - menuitem "Cycling" [ref=e142] [cursor=pointer]
                              - menuitem "Golf" [ref=e143] [cursor=pointer]
                              - menuitem "Mountain Biking" [ref=e144] [cursor=pointer]
                              - menuitem "Ski & Snowsports" [ref=e145] [cursor=pointer]
                              - menuitem "Walking & Hiking" [ref=e146] [cursor=pointer]
                              - menuitem "Watersports" [ref=e147] [cursor=pointer]
                          - navigation "vsMeganavFoodDrink" [ref=e148]:
                            - heading "Food & Drink" [level=2] [ref=e149]
                            - menu [ref=e150]:
                              - menuitem "All Food & Drink" [ref=e151] [cursor=pointer]
                              - menuitem "Beer & Breweries" [ref=e152] [cursor=pointer]
                              - menuitem "Gin tours & tastings" [ref=e153] [cursor=pointer]
                              - menuitem "Scottish whisky" [ref=e154] [cursor=pointer]
                          - navigation "vsMeganavLandscapesNature" [ref=e155]:
                            - heading "Landscapes & Nature" [level=2] [ref=e156]
                            - menu [ref=e157]:
                              - menuitem "All Landscapes & Nature" [ref=e158] [cursor=pointer]
                              - menuitem "Beaches" [ref=e159] [cursor=pointer]
                              - menuitem "Ben Nevis" [ref=e160] [cursor=pointer]
                              - menuitem "Lochs" [ref=e161] [cursor=pointer]
                              - menuitem "National Parks" [ref=e162] [cursor=pointer]
                              - menuitem "Northern Lights" [ref=e163] [cursor=pointer]
                              - menuitem "Standing Stones" [ref=e164] [cursor=pointer]
                              - menuitem "Wildlife Watching" [ref=e165] [cursor=pointer]
                          - navigation "vsMeganavToursRoutesTrails" [ref=e166]:
                            - heading "Tours, Routes & Trails" [level=2] [ref=e167]
                            - menu [ref=e168]:
                              - menuitem "All Tours, Routes & Trails" [ref=e169] [cursor=pointer]
                              - menuitem "Itineraries" [ref=e170] [cursor=pointer]
                              - menuitem "Scotland's UNESCO Trail" [ref=e171] [cursor=pointer]
                              - menuitem "Tours" [ref=e172] [cursor=pointer]
                              - menuitem "Walking Trails" [ref=e173] [cursor=pointer]
                          - navigation "vsMeganavEvents" [ref=e174]:
                            - heading "Events" [level=2] [ref=e175]
                            - menu [ref=e176]:
                              - menuitem "All Events" [ref=e177] [cursor=pointer]
                              - menuitem "Edinburgh's Summer Festivals" [ref=e178] [cursor=pointer]
                              - menuitem "FIFA World Cup 2026" [ref=e179] [cursor=pointer]
                              - menuitem "Glasgow 2026 Commonwealth Games" [ref=e180] [cursor=pointer]
                              - menuitem "Highland Games" [ref=e181] [cursor=pointer]
                              - menuitem "Scottish music festivals" [ref=e182] [cursor=pointer]
                              - menuitem "The Tour de France 2027 in Scotland" [ref=e183] [cursor=pointer]
                        - text: 
                - menuitem "Test Data" [ref=e184] [cursor=pointer]
                - menuitem "Accommodation" [ref=e185]:
                  - button "Accommodation" [ref=e186] [cursor=pointer]
                  - menu [ref=e187]:
                    - menuitem "All Accommodation vsMeganavHotelsLodgings vsMeganavCaravanCamping vsMeganavSelfCatering vsMeganavUniquePlaces vsMeganavOtherAccommodation" [ref=e188]:
                      - generic [ref=e191]:
                        - link "All Accommodation" [ref=e192] [cursor=pointer]:
                          - /url: /accommodation
                        - separator [ref=e193]
                        - generic [ref=e194]:
                          - navigation "vsMeganavHotelsLodgings" [ref=e195]:
                            - heading "Hotels & Lodgings" [level=2] [ref=e196]
                            - menu [ref=e197]:
                              - menuitem "B&Bs & Guesthouses" [ref=e198] [cursor=pointer]
                              - menuitem "Hostels" [ref=e199] [cursor=pointer]
                              - menuitem "Hotels" [ref=e200] [cursor=pointer]
                          - navigation "vsMeganavCaravanCamping" [ref=e201]:
                            - heading "Caravan & Camping" [level=2] [ref=e202]
                            - menu [ref=e203]:
                              - menuitem "All Caravan & Camping" [ref=e204] [cursor=pointer]
                              - menuitem "Glamping" [ref=e205] [cursor=pointer]
                              - menuitem "Wild Camping" [ref=e206] [cursor=pointer]
                          - navigation "vsMeganavSelfCatering" [ref=e207]:
                            - heading "Self Catering" [level=2] [ref=e208]
                            - menu [ref=e209]:
                              - menuitem "All Self Catering" [ref=e210] [cursor=pointer]
                              - menuitem "Cabins & Lodges" [ref=e211] [cursor=pointer]
                              - menuitem "Cottages" [ref=e212] [cursor=pointer]
                          - navigation "vsMeganavUniquePlaces" [ref=e213]:
                            - heading "Unique Places" [level=2] [ref=e214]
                            - menu [ref=e215]:
                              - menuitem "All Unique Places" [ref=e216] [cursor=pointer]
                              - menuitem "Castles" [ref=e217] [cursor=pointer]
                          - navigation "vsMeganavOtherAccommodation" [ref=e218]:
                            - heading "Other Accommodation" [level=2] [ref=e219]
                            - menu [ref=e220]:
                              - menuitem "Luxury Accommodation" [ref=e221] [cursor=pointer]
                              - menuitem "Pet Friendly Accommodation" [ref=e222] [cursor=pointer]
                              - menuitem "Romantic" [ref=e223] [cursor=pointer]
                              - menuitem "Wedding Venues" [ref=e224] [cursor=pointer]
                        - text: 
                - menuitem "Travel & planning" [ref=e225]:
                  - button "Travel & planning" [ref=e226] [cursor=pointer]
                  - menu [ref=e227]:
                    - menuitem "All Travel & planning vsMeganavTraveltoScotland vsMeganavTravelinScotland vsMeganavDrivinginScotland vsMeganavWhentovisit vsMeganavPracticalInformation vsMeganavIdeasAdvice vsMeganavHolidayTypes" [ref=e228]:
                      - generic [ref=e231]:
                        - link "All Travel & planning" [ref=e232] [cursor=pointer]:
                          - /url: /travel-planning
                        - separator [ref=e233]
                        - generic [ref=e234]:
                          - navigation "vsMeganavTraveltoScotland" [ref=e235]:
                            - heading "Travel to Scotland" [level=2] [ref=e236]
                            - menu [ref=e237]:
                              - menuitem "From England & Wales" [ref=e238] [cursor=pointer]
                              - menuitem "From Europe" [ref=e239] [cursor=pointer]
                              - menuitem "From Ireland" [ref=e240] [cursor=pointer]
                              - menuitem "From North America" [ref=e241] [cursor=pointer]
                              - menuitem "From Other Continents" [ref=e242] [cursor=pointer]
                          - navigation "vsMeganavTravelinScotland" [ref=e243]:
                            - heading "Travel in Scotland" [level=2] [ref=e244]
                            - menu [ref=e245]:
                              - menuitem "Air" [ref=e246] [cursor=pointer]
                              - menuitem "Bus & Coach" [ref=e247] [cursor=pointer]
                              - menuitem "Ferry" [ref=e248] [cursor=pointer]
                              - menuitem "Train" [ref=e249] [cursor=pointer]
                          - navigation "vsMeganavDrivinginScotland" [ref=e250]:
                            - heading "Driving in Scotland" [level=2] [ref=e251]
                            - menu [ref=e252]:
                              - menuitem "All Driving in Scotland" [ref=e253] [cursor=pointer]
                              - menuitem "Driving Routes" [ref=e254] [cursor=pointer]
                          - navigation "vsMeganavWhentovisit" [ref=e255]:
                            - heading "When to visit" [level=2] [ref=e256]
                            - menu [ref=e257]:
                              - menuitem "All When to visit" [ref=e258] [cursor=pointer]
                              - menuitem "Spring & Easter" [ref=e259] [cursor=pointer]
                              - menuitem "Summer Breaks" [ref=e260] [cursor=pointer]
                              - menuitem "Autumn Breaks" [ref=e261] [cursor=pointer]
                              - menuitem "Winter, Christmas & New Year" [ref=e262] [cursor=pointer]
                          - navigation "vsMeganavPracticalInformation" [ref=e263]:
                            - heading "Practical Information" [level=2] [ref=e264]
                            - menu [ref=e265]:
                              - menuitem "Eco-Travel" [ref=e266] [cursor=pointer]
                              - menuitem "FAQs" [ref=e267] [cursor=pointer]
                              - menuitem "Passes & Offers" [ref=e268] [cursor=pointer]
                              - menuitem "Passports & Visas" [ref=e269] [cursor=pointer]
                              - menuitem "Weather" [ref=e270] [cursor=pointer]
                          - navigation "vsMeganavIdeasAdvice" [ref=e271]:
                            - heading "Ideas & Advice" [level=2] [ref=e272]
                            - menu [ref=e273]:
                              - menuitem "Outdoor Safety Information" [ref=e274] [cursor=pointer]
                              - menuitem "Travel Blog" [ref=e275] [cursor=pointer]
                              - menuitem "Travel Newsletter" [ref=e276] [cursor=pointer]
                          - navigation "vsMeganavHolidayTypes" [ref=e277]:
                            - heading "Holiday Types" [level=2] [ref=e278]
                            - menu [ref=e279]:
                              - menuitem "Accessible Holidays" [ref=e280] [cursor=pointer]
                              - menuitem "Beauty Spots" [ref=e281] [cursor=pointer]
                              - menuitem "Budget-Friendly Holidays" [ref=e282] [cursor=pointer]
                              - menuitem "Countryside Breaks" [ref=e283] [cursor=pointer]
                              - menuitem "Family Holidays" [ref=e284] [cursor=pointer]
                              - menuitem "Farm Stays" [ref=e285] [cursor=pointer]
                              - menuitem "Off the Beaten Track Holidays" [ref=e286] [cursor=pointer]
                              - menuitem "Weekend Breaks" [ref=e287] [cursor=pointer]
                              - menuitem "Wellness Retreats" [ref=e288] [cursor=pointer]
                        - text: 
                - menuitem "Map of Scotland" [ref=e289] [cursor=pointer]
              - generic:  
          - text:  
    - banner [ref=e290]:
      - generic [ref=e292]:
        - generic [ref=e294]:
          - generic [ref=e295]:
            - generic: 
          - generic [ref=e297]:
            - paragraph [ref=e299]: "BETA: The search and map are new features with further enhancements planned. VisitScotland is not responsible for the content of external links and accepts no liability for any reliance on these."
            - link "Your feedback will help improve the site" [ref=e301] [cursor=pointer]:
              - /url: https://forms.office.com/Pages/ResponsePage.aspx?id=i6cHlOa1sE2MK35GwX69WtIEyFSgaDlCoMG4KNaUei9URFhFNFhDWFVUQTlRMFBUQ0Y0OTIzQzg2Vi4u
              - text: Your feedback will help improve the site
        - button " Close" [ref=e303] [cursor=pointer]:
          - generic: 
          - generic [ref=e304]: Close
    - main [ref=e305]:
      - generic [ref=e307]:
        - button "Pause Video" [ref=e312] [cursor=pointer]:
          - generic: 
          - generic [ref=e313]: Pause Video
        - generic [ref=e315]:
          - heading "Start Your Story in Scotland" [level=1] [ref=e316]
          - paragraph [ref=e318]: Where history meets breathtaking beauty, and every visit feels like an escape.
      - generic [ref=e319]:
        - generic [ref=e325]:
          - heading "Inspiration for your trip" [level=2] [ref=e327]
          - paragraph [ref=e331]: Step into a land steeped in history and legend, explore our dramatic landscapes and uncover our ancient Celtic roots. Vast lochs, glens and Munros - easily accessible from our vibrant cities and towns - make Scotland the perfect place to lose yourself.
        - generic [ref=e334]:
          - generic [ref=e335]:  
          - generic [ref=e339]:
            - group "Slide 1 of 4" [ref=e340]:
              - heading "Places to go" [level=2] [ref=e345]:
                - link "Places to go" [ref=e346] [cursor=pointer]:
                  - /url: /places-to-go
            - group "Slide 2 of 4" [ref=e348]:
              - heading "Things to do" [level=2] [ref=e353]:
                - link "Things to do" [ref=e354] [cursor=pointer]:
                  - /url: /things-to-do
            - group "Slide 3 of 4" [ref=e356]:
              - heading "Accommodation" [level=2] [ref=e361]:
                - link "Accommodation" [ref=e362] [cursor=pointer]:
                  - /url: /accommodation
            - group "Slide 4 of 4" [ref=e364]:
              - heading "Travel & planning" [level=2] [ref=e369]:
                - link "Travel & planning" [ref=e370] [cursor=pointer]:
                  - /url: /travel-planning
      - generic [ref=e373]:
        - generic [ref=e380]:
          - heading "Plan an epic trip to Scotland" [level=2] [ref=e382]
          - paragraph [ref=e386]: Did we catch your eye during the 2026 World Cup? Or did you hear our lively Tartan Army first? It may have taken us 28 years to secure a win, but you don't need to wait that long to book a fantastic holiday to Scotland, with our breathtaking landscapes, unmissable events and friendly Scots.
        - generic [ref=e388]:
          - generic:  
          - generic [ref=e390]:
            - group "Slide 1 of 4" [ref=e391]:
              - generic [ref=e394]:
                - heading "Highland games in Scotland" [level=3] [ref=e395]:
                  - link "Highland games in Scotland" [ref=e396] [cursor=pointer]:
                    - /url: /things-to-do/events/highland-games
                - paragraph [ref=e398]: From the tug o' war to the caber toss, Scotland's Highland games are not to be missed.
            - group "Slide 2 of 4" [ref=e399]:
              - generic [ref=e402]:
                - heading "The Northern Lights in Scotland" [level=3] [ref=e403]:
                  - link "The Northern Lights in Scotland" [ref=e404] [cursor=pointer]:
                    - /url: /things-to-do/landscapes-nature/northern-lights
                - paragraph [ref=e406]: Nature's most dramatic winter light display. Discover more about this otherworldly natural phenomenon.
            - group "Slide 3 of 4" [ref=e407]:
              - generic [ref=e410]:
                - heading "12 Must-visit historic towns in Scotland" [level=3] [ref=e411]:
                  - link "12 Must-visit historic towns in Scotland" [ref=e412] [cursor=pointer]:
                    - /url: /places-to-go/scottish-towns/historic
                - paragraph [ref=e414]: Get ready to take a journey through some of the finest historic towns in Scotland.
            - group "Slide 4 of 4" [ref=e415]:
              - generic [ref=e418]:
                - heading "Scottish whisky" [level=3] [ref=e419]:
                  - link "Scottish whisky" [ref=e420] [cursor=pointer]:
                    - /url: /things-to-do/food-drink/whisky
                - paragraph [ref=e422]: Whisky is Scotland's best known export and has been proudly produced throughout the country for hundreds of years.
      - generic [ref=e430]:
        - heading "Final countdown to Glasgow 2026 Commonwealth Games" [level=2] [ref=e431]
        - paragraph [ref=e433]: Follow the King’s Baton Relay across Scotland as we countdown to 11 days of world-class action with 3,000 athletes from 74 nations competing across 10 sports!
        - link "Glasgow 2026 Commonwealth Games" [ref=e434] [cursor=pointer]:
          - /url: /things-to-do/events/glasgow-commonwealth-games
          - generic [ref=e435]: Glasgow 2026 Commonwealth Games
      - generic [ref=e438]:
        - generic [ref=e444]:
          - heading "Discover unique experiences in Scotland" [level=2] [ref=e446]
          - paragraph [ref=e450]: Discover hidden gems, plan your perfect trip, or find exactly what you need—from scenic hikes and cosy cottages to events and cultural experiences.
        - generic [ref=e451]:
          - generic [ref=e452]:
            - generic [ref=e453]:
              - generic [ref=e454]:
                - generic [ref=e455]: What are you looking for?
                - generic: 
              - searchbox "What are you looking for?" [ref=e457]
            - button "Search" [ref=e458] [cursor=pointer]:
              - generic [ref=e459]: Search
          - generic [ref=e462]:
            - button "Accommodation category" [ref=e463] [cursor=pointer]:
              - generic: 
              - generic [ref=e464]: Accommodation
            - button "Adventure category" [ref=e465] [cursor=pointer]:
              - generic: 
              - generic [ref=e466]: Adventure
            - button "City Break category" [ref=e467] [cursor=pointer]:
              - generic: 
              - generic [ref=e468]: City Break
            - button "Culture & History category" [ref=e469] [cursor=pointer]:
              - generic: 
              - generic [ref=e470]: Culture & History
            - button "Events & Festivals category" [ref=e471] [cursor=pointer]:
              - generic: 
              - generic [ref=e472]: Events & Festivals
            - button "Family category" [ref=e473] [cursor=pointer]:
              - generic: 
              - generic [ref=e474]: Family
            - button "Food & Drink category" [ref=e475] [cursor=pointer]:
              - generic: 
              - generic [ref=e476]: Food & Drink
            - button "Nature & Outdoors category" [ref=e477] [cursor=pointer]:
              - generic: 
              - generic [ref=e478]: Nature & Outdoors
            - button "Tours category" [ref=e479] [cursor=pointer]:
              - generic: 
              - generic [ref=e480]: Tours
            - button "Travel category" [ref=e481] [cursor=pointer]:
              - generic: 
              - generic [ref=e482]: Travel
            - button "Wellness category" [ref=e483] [cursor=pointer]:
              - generic: 
              - generic [ref=e484]: Wellness
      - generic [ref=e486]:
        - heading "Discover Scotland's vibrant events and festivals" [level=2] [ref=e495]
        - generic [ref=e498]:
          - generic:  
          - generic [ref=e500]:
            - group "Slide 1 of 3" [ref=e501]:
              - generic [ref=e504]:
                - heading "FIFA World Cup 2026" [level=3] [ref=e505]:
                  - link "FIFA World Cup 2026" [ref=e506] [cursor=pointer]:
                    - /url: /things-to-do/events/fifa-world-cup
                - paragraph [ref=e508]: Cheer on Scotland at the FIFA World Cup 2026 and find information about fan zones in Scotland, stadium tours and more.
            - group "Slide 2 of 3" [ref=e509]:
              - generic [ref=e512]:
                - heading "Edinburgh Festivals" [level=3] [ref=e513]:
                  - link "Edinburgh Festivals" [ref=e514] [cursor=pointer]:
                    - /url: /things-to-do/events/edinburgh-festivals
                - paragraph [ref=e516]: Discover Edinburgh's summer festivals, including the world-famous Edinburgh International Festival and Edinburgh Festival Fringe.
            - group "Slide 3 of 3" [ref=e517]:
              - generic [ref=e520]:
                - heading "Events and festivals in Scotland" [level=3] [ref=e521]:
                  - link "Events and festivals in Scotland" [ref=e522] [cursor=pointer]:
                    - /url: /things-to-do/events
                - paragraph [ref=e524]: There's something happening in Scotland right now that the whole family will love.
      - generic [ref=e526]:
        - generic [ref=e533]:
          - heading "Summertime in Scotland" [level=2] [ref=e535]
          - paragraph [ref=e539]: Embrace long summer days in Scotland with plenty of experiences to enjoy from gentle coastal walks by the sea to festivals filled with local tunes, incredible art and hilarious comedy.
        - generic [ref=e541]:
          - generic:  
          - generic [ref=e543]:
            - group "Slide 1 of 4" [ref=e544]:
              - generic [ref=e547]:
                - heading "Summer holidays & breaks in Scotland" [level=3] [ref=e548]:
                  - link "Summer holidays & breaks in Scotland" [ref=e549] [cursor=pointer]:
                    - /url: /travel-planning/when-to-visit/summer
                - paragraph [ref=e551]: Find ideas and inspiration, from family days out to top camping spots, walks and outdoor activities.
            - group "Slide 2 of 4" [ref=e552]:
              - generic [ref=e555]:
                - heading "Scotland's islands" [level=3] [ref=e556]:
                  - link "Scotland's islands" [ref=e557] [cursor=pointer]:
                    - /url: /places-to-go/islands
                - paragraph [ref=e559]: Find out about the hundreds of islands in Scotland including Arran, Lewis, Skye, Outer Hebrides and Shetland. Plan the perfect island getaway today.
            - group "Slide 3 of 4" [ref=e560]:
              - generic [ref=e563]:
                - heading "Scottish music festivals" [level=3] [ref=e564]:
                  - link "Scottish music festivals" [ref=e565] [cursor=pointer]:
                    - /url: /things-to-do/events/music-festivals
                - paragraph [ref=e567]: Find out what’s happening in Scotland this year
            - group "Slide 4 of 4" [ref=e568]:
              - generic [ref=e571]:
                - heading "The best tours of Scotland - luxury & scenic tours" [level=3] [ref=e572]:
                  - link "The best tours of Scotland - luxury & scenic tours" [ref=e573] [cursor=pointer]:
                    - /url: /travel-planning/touring
                - paragraph [ref=e575]: Tour Scotland at your own pace with these fantastic ideas.
      - generic [ref=e583]:
        - heading "Your Scottish adventure starts here" [level=2] [ref=e584]
        - paragraph [ref=e586]: Use our interactive map to explore wild landscapes, vibrant cities, rich culture, and hidden historic gems to craft your personal Scottish experience.
        - link "Map of Scotland" [ref=e587] [cursor=pointer]:
          - /url: /map
          - generic [ref=e588]: Map of Scotland
      - generic [ref=e590]:
        - generic [ref=e597]:
          - heading "Scotland as seen on TV!" [level=2] [ref=e599]
          - paragraph [ref=e603]: From Tara Lipinski and Johnny Weir's luxury Scotland itinerary to local suggestions on the highlights of Glasgow and Dumfries & Galloway, check out this top advice on trips across Scotland.
        - generic [ref=e605]:
          - generic:  
          - generic [ref=e607]:
            - group "Slide 1 of 3" [ref=e608]:
              - generic [ref=e611]:
                - heading "Tara & Johnny's luxury Scotland itinerary" [level=3] [ref=e612]:
                  - link "Tara & Johnny's luxury Scotland itinerary" [ref=e613] [cursor=pointer]:
                    - /url: /things-to-do/itineraries/extra-mile-club-scotland
                - paragraph [ref=e615]: Have you been inspired by Tara & Johnny's Scotland itinerary as seen on NBC's Extra Mile Club? Read on and plan your own Scottish adventure.
            - group "Slide 2 of 3" [ref=e616]:
              - generic [ref=e619]:
                - heading "Channel 4's Where to next? Scotland itinerary" [level=3] [ref=e620]:
                  - link "Channel 4's Where to next? Scotland itinerary" [ref=e621] [cursor=pointer]:
                    - /url: /things-to-do/itineraries/where-to-next
                - paragraph [ref=e623]: Follow in the footsteps of comedians Fatiha El-Ghorri and John Tothill on their unforgettable journey through Scotland.
            - group "Slide 3 of 3" [ref=e624]:
              - generic [ref=e627]:
                - heading "Scotland trip itineraries" [level=3] [ref=e628]:
                  - link "Scotland trip itineraries" [ref=e629] [cursor=pointer]:
                    - /url: /things-to-do/itineraries
                - paragraph [ref=e631]: Plan your days in Scotland with the help of our suggested itineraries.
      - generic [ref=e634]:
        - heading "Your pictures of Scotland" [level=2] [ref=e638]
        - generic [ref=e642]:
          - text: i i i i i i i i i i i i i i i i i i i i
          - generic [ref=e644]:
            - generic: 
            - paragraph [ref=e647]: JavaScript needs to be enabled to see social media images for this place. You can turn this on in your browser settings.
      - generic [ref=e650]:
        - heading "Share on" [level=2] [ref=e653]
        - generic [ref=e654]:
          - link " Facebook" [ref=e656] [cursor=pointer]:
            - /url: https://www.facebook.com/sharer/sharer.php?u=http://localhost:3070/&t=Start%20Your%20Story%20in%20Scotland
            - generic: 
            - text: Facebook
          - link " Pinterest" [ref=e658] [cursor=pointer]:
            - /url: https://www.pinterest.com/pin/create/button/?url=http://localhost:3070/
            - generic: 
            - text: Pinterest
          - link " WhatsApp" [ref=e660] [cursor=pointer]:
            - /url: https://wa.me/?text=Start%20Your%20Story%20in%20Scotland%20-%20http://localhost:3070/
            - generic: 
            - text: WhatsApp
          - link " Twitter" [ref=e662] [cursor=pointer]:
            - /url: https://twitter.com/intent/tweet?text=Start%20Your%20Story%20in%20Scotland%20@VisitScotland&url=http://localhost:3070/
            - generic: 
            - text: Twitter
          - link " Email" [ref=e664] [cursor=pointer]:
            - /url: mailto:?body=Start%20Your%20Story%20in%20Scotland%20-%20http://localhost:3070/&subject=Start%20Your%20Story%20in%20Scotland
            - generic: 
            - text: Email
      - generic [ref=e671]:
        - generic [ref=e672]:
          - heading "Join our Newsletter Clan" [level=2] [ref=e673]
          - paragraph [ref=e675]: Get Scotland inspiration direct to your inbox. Don't miss the inside track from our Scotland experts on exciting trip ideas, unique attractions and hidden gems loved by locals.
        - link "Get the Scotland newsletter" [ref=e677] [cursor=pointer]:
          - /url: /newsletter
          - generic [ref=e678]: Get the Scotland newsletter
    - contentinfo [ref=e679]:
      - generic [ref=e683]:
        - generic [ref=e685]:
          - generic [ref=e686]:
            - text: 
            - heading "Visitor information" [level=2] [ref=e687]
          - menu [ref=e689]:
            - menuitem "Test Data" [ref=e690]:
              - link "Test Data" [ref=e691] [cursor=pointer]:
                - /url: /test
            - menuitem "Accommodation" [ref=e692]:
              - link "Accommodation" [ref=e693] [cursor=pointer]:
                - /url: /sandbox
        - generic [ref=e695]:
          - generic [ref=e696]:
            - text: 
            - heading "Get in touch" [level=2] [ref=e697]
          - menu [ref=e699]:
            - menuitem "Contact us" [ref=e700]:
              - link "Contact us" [ref=e701] [cursor=pointer]:
                - /url: /contact-us
            - menuitem "Feedback & Complaints " [ref=e702]:
              - link "Feedback & Complaints " [ref=e703] [cursor=pointer]:
                - /url: https://www.visitscotland.org/about-us/our-policies/complaints-feedback
                - text: Feedback & Complaints
                - generic: 
            - menuitem "Submit an event" [ref=e704]:
              - link "Submit an event" [ref=e705] [cursor=pointer]:
                - /url: /things-to-do/events/submit-event
        - generic [ref=e707]:
          - generic [ref=e708]:
            - text: 
            - heading "Our other sites" [level=2] [ref=e709]
          - menu [ref=e711]:
            - menuitem "Business Events " [ref=e712]:
              - link "Business Events " [ref=e713] [cursor=pointer]:
                - /url: https://businessevents.visitscotland.com/
                - text: Business Events
                - generic: 
            - menuitem "Business Support Hub " [ref=e714]:
              - link "Business Support Hub " [ref=e715] [cursor=pointer]:
                - /url: https://support.visitscotland.org/
                - text: Business Support Hub
                - generic: 
            - menuitem "Travel Trade " [ref=e716]:
              - link "Travel Trade " [ref=e717] [cursor=pointer]:
                - /url: https://traveltrade.visitscotland.org/
                - text: Travel Trade
                - generic: 
            - menuitem "Asset library " [ref=e718]:
              - link "Asset library " [ref=e719] [cursor=pointer]:
                - /url: https://visitscotland.canto.global/v/visitscotlandassetlibrary
                - text: Asset library
                - generic: 
            - menuitem "Corporate " [ref=e720]:
              - link "Corporate " [ref=e721] [cursor=pointer]:
                - /url: https://www.visitscotland.org/
                - text: Corporate
                - generic: 
            - menuitem "Brand Scotland " [ref=e722]:
              - link "Brand Scotland " [ref=e723] [cursor=pointer]:
                - /url: https://www.scotland.org/
                - text: Brand Scotland
                - generic: 
        - generic [ref=e725]:
          - heading "Find us on" [level=2] [ref=e726]
          - list [ref=e727]:
            - listitem [ref=e728]:
              - link "fab fa-youtube" [ref=e729] [cursor=pointer]:
                - /url: https://www.youtube.com/channel/UC1FdvQG5MFwzv0PY6dMsaFg
                - generic: 
                - text: 
            - listitem [ref=e730]:
              - link "fab fa-x-twitter" [ref=e731] [cursor=pointer]:
                - /url: https://twitter.com/VisitScotland
                - generic: 
                - text: 
            - listitem [ref=e732]:
              - link "fab fa-facebook" [ref=e733] [cursor=pointer]:
                - /url: https://www.facebook.com/visitscotland/
                - generic: 
                - text: 
            - listitem [ref=e734]:
              - link "fab fa-instagram" [ref=e735] [cursor=pointer]:
                - /url: https://www.instagram.com/visitscotland/
                - generic: 
                - text: 
      - generic:
        - generic:
          - generic:        
      - menu [ref=e740]:
        - menuitem "About us " [ref=e741]:
          - link "About us " [ref=e742] [cursor=pointer]:
            - /url: https://www.visitscotland.org/what-we-do
            - text: About us
            - generic: 
        - menuitem "Accessibility" [ref=e743]:
          - link "Accessibility" [ref=e744] [cursor=pointer]:
            - /url: /policies/accessibility
        - menuitem "Acceptable use" [ref=e745]:
          - link "Acceptable use" [ref=e746] [cursor=pointer]:
            - /url: /policies/acceptable-use
        - menuitem "Cookies" [ref=e747]:
          - link "Cookies" [ref=e748] [cursor=pointer]:
            - /url: /policies/privacy/cookies
        - menuitem "Environmental policy" [ref=e749]:
          - link "Environmental policy" [ref=e750] [cursor=pointer]:
            - /url: /policies/environmental
        - menuitem "Privacy " [ref=e751]:
          - link "Privacy " [ref=e752] [cursor=pointer]:
            - /url: https://www.visitscotland.org/what-we-do/privacy-centre
            - text: Privacy
            - generic: 
        - menuitem "Social media" [ref=e753]:
          - link "Social media" [ref=e754] [cursor=pointer]:
            - /url: /policies/terms-conditions/social-media
        - menuitem "Terms of use" [ref=e755]:
          - link "Terms of use" [ref=e756] [cursor=pointer]:
            - /url: /policies/terms-conditions
      - generic [ref=e760]:
        - link "Brand Scotland":
          - /url: https://www.scotland.org/
          - generic [ref=e761] [cursor=pointer]: Brand Scotland
        - paragraph [ref=e762]: © 2026 VisitScotland. All rights reserved.
  - generic:
    - img
  - generic [ref=e763]:
    - button "Toggle Nuxt DevTools" [ref=e764] [cursor=pointer]:
      - img [ref=e765]
    - generic "App load time" [ref=e768]:
      - generic [ref=e769]: "2.1"
      - generic [ref=e770]: s
    - button "Toggle Component Inspector" [ref=e772] [cursor=pointer]:
      - img [ref=e773]
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
  38 |                 await browserPage.goto(page.path, { waitUntil: 'networkidle' });
  39 | 
  40 |                 await waitForHydration(browserPage);
  41 | 
> 42 |                 await expect(browserPage).toHaveScreenshot(
     |                                           ^ Error: expect(page).toHaveScreenshot(expected) failed
  43 |                     `${page.name.toLowerCase().replace(/\s+/g, '-')}.png`,
  44 |                     { fullPage: true },
  45 |                 );
  46 |             });
  47 |         }
  48 |     });
  49 | }
  50 | 
```