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

Timeout: 5000ms
  Failed to take two consecutive stable screenshots.

  Snapshot: homepage.png

Call log:
  - Expect "toHaveScreenshot(homepage.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 7924px, received 1280px by 7493px. 1415622 pixels (ratio 0.14 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 7493px, received 1280px by 7924px. 1410489 pixels (ratio 0.14 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Timeout 5000ms exceeded.

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
      - generic [ref=e90]:
        - heading "Start Your Story in Scotland" [level=1] [ref=e91]
        - paragraph [ref=e93]: Where history meets breathtaking beauty, and every visit feels like an escape.
      - generic [ref=e94]:
        - generic [ref=e100]:
          - heading "Inspiration for your trip" [level=2] [ref=e102]
          - paragraph [ref=e106]: Step into a land steeped in history and legend, explore our dramatic landscapes and uncover our ancient Celtic roots. Vast lochs, glens and Munros - easily accessible from our vibrant cities and towns - make Scotland the perfect place to lose yourself.
        - generic [ref=e108]:
          - generic [ref=e112]:
            - button "Previous slide" [disabled]:
              - generic: 
              - generic: previous
            - button "Next slide" [ref=e113] [cursor=pointer]:
              - generic: 
              - generic [ref=e114]: next
          - generic [ref=e116]:
            - group "Slide 1 of 4" [ref=e117]:
              - heading [level=2] [ref=e122]:
                - link "Places to go" [ref=e123] [cursor=pointer]:
                  - /url: /places-to-go
            - group "Slide 2 of 4" [ref=e125]:
              - heading [level=2] [ref=e130]:
                - link "Things to do" [ref=e131] [cursor=pointer]:
                  - /url: /things-to-do
            - group "Slide 3 of 4" [ref=e133]:
              - heading [level=2] [ref=e138]:
                - link "Accommodation" [ref=e139] [cursor=pointer]:
                  - /url: /accommodation
            - group "Slide 4 of 4" [ref=e141]:
              - heading [level=2] [ref=e146]:
                - link "Travel & planning" [ref=e147] [cursor=pointer]:
                  - /url: /travel-planning
      - generic [ref=e149]:
        - generic [ref=e150]:
          - generic [ref=e156]:
            - heading "Plan an epic trip to Scotland" [level=2] [ref=e158]
            - paragraph [ref=e162]: Did we catch your eye during the 2026 World Cup? Or did you hear our lively Tartan Army first? It may have taken us 28 years to secure a win, but you don't need to wait that long to book a fantastic holiday to Scotland, with our breathtaking landscapes, unmissable events and friendly Scots.
          - generic [ref=e164]:
            - generic:  
            - generic [ref=e166]:
              - group "Slide 1 of 4" [ref=e167]:
                - generic [ref=e170]:
                  - heading [level=3] [ref=e171]:
                    - link "Highland games in Scotland" [ref=e172] [cursor=pointer]:
                      - /url: /things-to-do/events/highland-games
                  - paragraph [ref=e174]: From the tug o' war to the caber toss, Scotland's Highland games are not to be missed.
              - group "Slide 2 of 4" [ref=e175]:
                - generic [ref=e178]:
                  - heading [level=3] [ref=e179]:
                    - link "The Northern Lights in Scotland" [ref=e180] [cursor=pointer]:
                      - /url: /things-to-do/landscapes-nature/northern-lights
                  - paragraph [ref=e182]: Nature's most dramatic winter light display. Discover more about this otherworldly natural phenomenon.
              - group "Slide 3 of 4" [ref=e183]:
                - generic [ref=e186]:
                  - heading [level=3] [ref=e187]:
                    - link "12 Must-visit historic towns in Scotland" [ref=e188] [cursor=pointer]:
                      - /url: /places-to-go/scottish-towns/historic
                  - paragraph [ref=e190]: Get ready to take a journey through some of the finest historic towns in Scotland.
              - group "Slide 4 of 4" [ref=e191]:
                - generic [ref=e194]:
                  - heading [level=3] [ref=e195]:
                    - link "Scottish whisky" [ref=e196] [cursor=pointer]:
                      - /url: /things-to-do/food-drink/whisky
                  - paragraph [ref=e198]: Whisky is Scotland's best known export and has been proudly produced throughout the country for hundreds of years.
        - generic [ref=e206]:
          - heading "Final countdown to Glasgow 2026 Commonwealth Games" [level=2] [ref=e207]
          - paragraph [ref=e209]: Follow the King’s Baton Relay across Scotland as we countdown to 11 days of world-class action with 3,000 athletes from 74 nations competing across 10 sports!
          - link "Glasgow 2026 Commonwealth Games" [ref=e210] [cursor=pointer]:
            - /url: /things-to-do/events/glasgow-commonwealth-games
        - generic [ref=e214]:
          - generic [ref=e220]:
            - heading "Discover unique experiences in Scotland" [level=2] [ref=e222]
            - paragraph [ref=e226]: Discover hidden gems, plan your perfect trip, or find exactly what you need—from scenic hikes and cosy cottages to events and cultural experiences.
          - generic [ref=e227]:
            - generic [ref=e228]:
              - generic [ref=e229]:
                - generic [ref=e230]:
                  - generic [ref=e231]: What are you looking for?
                  - generic: 
                - searchbox "What are you looking for? " [ref=e233]
              - button "Search" [ref=e234] [cursor=pointer]
            - generic [ref=e238]:
              - button "Accommodation category" [ref=e239] [cursor=pointer]:
                - generic: 
                - generic [ref=e240]: Accommodation
              - button "Adventure category" [ref=e241] [cursor=pointer]:
                - generic: 
                - generic [ref=e242]: Adventure
              - button "City Break category" [ref=e243] [cursor=pointer]:
                - generic: 
                - generic [ref=e244]: City Break
              - button "Culture & History category" [ref=e245] [cursor=pointer]:
                - generic: 
                - generic [ref=e246]: Culture & History
              - button "Events & Festivals category" [ref=e247] [cursor=pointer]:
                - generic: 
                - generic [ref=e248]: Events & Festivals
              - button "Family category" [ref=e249] [cursor=pointer]:
                - generic: 
                - generic [ref=e250]: Family
              - button "Food & Drink category" [ref=e251] [cursor=pointer]:
                - generic: 
                - generic [ref=e252]: Food & Drink
              - button "Nature & Outdoors category" [ref=e253] [cursor=pointer]:
                - generic: 
                - generic [ref=e254]: Nature & Outdoors
              - button "Tours category" [ref=e255] [cursor=pointer]:
                - generic: 
                - generic [ref=e256]: Tours
              - button "Travel category" [ref=e257] [cursor=pointer]:
                - generic: 
                - generic [ref=e258]: Travel
              - button "Wellness category" [ref=e259] [cursor=pointer]:
                - generic: 
                - generic [ref=e260]: Wellness
        - generic [ref=e261]:
          - heading "Discover Scotland's vibrant events and festivals" [level=2] [ref=e269]
          - generic [ref=e272]:
            - generic:  
            - generic [ref=e274]:
              - group "Slide 1 of 3" [ref=e275]:
                - generic [ref=e278]:
                  - heading [level=3] [ref=e279]:
                    - link "FIFA World Cup 2026" [ref=e280] [cursor=pointer]:
                      - /url: /things-to-do/events/fifa-world-cup
                  - paragraph [ref=e282]: Cheer on Scotland at the FIFA World Cup 2026 and find information about fan zones in Scotland, stadium tours and more.
              - group "Slide 2 of 3" [ref=e283]:
                - generic [ref=e286]:
                  - heading [level=3] [ref=e287]:
                    - link "Edinburgh Festivals" [ref=e288] [cursor=pointer]:
                      - /url: /things-to-do/events/edinburgh-festivals
                  - paragraph [ref=e290]: Discover Edinburgh's summer festivals, including the world-famous Edinburgh International Festival and Edinburgh Festival Fringe.
              - group "Slide 3 of 3" [ref=e291]:
                - generic [ref=e294]:
                  - heading [level=3] [ref=e295]:
                    - link "Events and festivals in Scotland" [ref=e296] [cursor=pointer]:
                      - /url: /things-to-do/events
                  - paragraph [ref=e298]: There's something happening in Scotland right now that the whole family will love.
        - generic [ref=e299]:
          - generic [ref=e305]:
            - heading "Summertime in Scotland" [level=2] [ref=e307]
            - paragraph [ref=e311]: Embrace long summer days in Scotland with plenty of experiences to enjoy from gentle coastal walks by the sea to festivals filled with local tunes, incredible art and hilarious comedy.
          - generic [ref=e313]:
            - generic:  
            - generic [ref=e315]:
              - group "Slide 1 of 4" [ref=e316]:
                - generic [ref=e319]:
                  - heading [level=3] [ref=e320]:
                    - link "Summer holidays & breaks in Scotland" [ref=e321] [cursor=pointer]:
                      - /url: /travel-planning/when-to-visit/summer
                  - paragraph [ref=e323]: Find ideas and inspiration, from family days out to top camping spots, walks and outdoor activities.
              - group "Slide 2 of 4" [ref=e324]:
                - generic [ref=e327]:
                  - heading [level=3] [ref=e328]:
                    - link "Scotland's islands" [ref=e329] [cursor=pointer]:
                      - /url: /places-to-go/islands
                  - paragraph [ref=e331]: Find out about the hundreds of islands in Scotland including Arran, Lewis, Skye, Outer Hebrides and Shetland. Plan the perfect island getaway today.
              - group "Slide 3 of 4" [ref=e332]:
                - generic [ref=e335]:
                  - heading [level=3] [ref=e336]:
                    - link "Scottish music festivals" [ref=e337] [cursor=pointer]:
                      - /url: /things-to-do/events/music-festivals
                  - paragraph [ref=e339]: Find out what’s happening in Scotland this year
              - group "Slide 4 of 4" [ref=e340]:
                - generic [ref=e343]:
                  - heading [level=3] [ref=e344]:
                    - link "The best tours of Scotland - luxury & scenic tours" [ref=e345] [cursor=pointer]:
                      - /url: /travel-planning/touring
                  - paragraph [ref=e347]: Tour Scotland at your own pace with these fantastic ideas.
        - generic [ref=e355]:
          - heading "Your Scottish adventure starts here" [level=2] [ref=e356]
          - paragraph [ref=e358]: Use our interactive map to explore wild landscapes, vibrant cities, rich culture, and hidden historic gems to craft your personal Scottish experience.
          - link "Map of Scotland" [ref=e359] [cursor=pointer]:
            - /url: /map
        - generic [ref=e361]:
          - generic [ref=e367]:
            - heading "Scotland as seen on TV!" [level=2] [ref=e369]
            - paragraph [ref=e373]: From Tara Lipinski and Johnny Weir's luxury Scotland itinerary to local suggestions on the highlights of Glasgow and Dumfries & Galloway, check out this top advice on trips across Scotland.
          - generic [ref=e375]:
            - generic:  
            - generic [ref=e377]:
              - group "Slide 1 of 3" [ref=e378]:
                - generic [ref=e381]:
                  - heading [level=3] [ref=e382]:
                    - link "Tara & Johnny's luxury Scotland itinerary" [ref=e383] [cursor=pointer]:
                      - /url: /things-to-do/itineraries/extra-mile-club-scotland
                  - paragraph [ref=e385]: Have you been inspired by Tara & Johnny's Scotland itinerary as seen on NBC's Extra Mile Club? Read on and plan your own Scottish adventure.
              - group "Slide 2 of 3" [ref=e386]:
                - generic [ref=e389]:
                  - heading [level=3] [ref=e390]:
                    - link "Channel 4's Where to next? Scotland itinerary" [ref=e391] [cursor=pointer]:
                      - /url: /things-to-do/itineraries/where-to-next
                  - paragraph [ref=e393]: Follow in the footsteps of comedians Fatiha El-Ghorri and John Tothill on their unforgettable journey through Scotland.
              - group "Slide 3 of 3" [ref=e394]:
                - generic [ref=e397]:
                  - heading [level=3] [ref=e398]:
                    - link "Scotland trip itineraries" [ref=e399] [cursor=pointer]:
                      - /url: /things-to-do/itineraries
                  - paragraph [ref=e401]: Plan your days in Scotland with the help of our suggested itineraries.
        - generic [ref=e403]:
          - heading "Your pictures of Scotland" [level=2] [ref=e411]
          - generic [ref=e415]:
            - paragraph [ref=e418]: Share your images by tagging @VisitScotland
            - generic [ref=e419]:
              - generic [ref=e421]:
                - generic:
                  - generic:
                    - button "Close product tray"
                - generic [ref=e422]:
                  - button "Move Carousel to previous item" [ref=e423] [cursor=pointer]
                  - generic [ref=e425]:
                    - button [ref=e429] [cursor=pointer]:
                      - button "Read more The Golden Hour; Tobermory bay at the start of a b..." [ref=e430]
                      - generic [ref=e431]:
                        - generic:
                          - generic:
                            - img "Instagram post by nicola_turner_photography"
                        - generic [aria-hidden] [ref=e433]:
                          - generic [ref=e434]: instagram-hashtag
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453c/the-golden-hour3b-t/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453c/the-golden-hour3b-t/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453c/the-golden-hour3b-t/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453c/the-golden-hour3b-t/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/2324e6608864fd09867f3c555189fda1571c1929169410796d9b7b99.jpg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453c/the-golden-hour3b-t/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button "Read more Nature’s cinema The average person spends around... Video by traveltwo_ click to expand item and play video" [ref=e438] [cursor=pointer]:
                      - button "Read more Nature’s cinema The average person spends around..." [ref=e439]
                      - generic [ref=e440]:
                        - generic "Video by traveltwo_" [ref=e441]
                        - button "click to expand item and play video" [ref=e442]: "&"
                        - generic [aria-hidden] [ref=e444]:
                          - generic [ref=e445]: instagram-tagged
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468253/naturee28099s-cin/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468253/naturee28099s-cin/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468253/naturee28099s-cin/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468253/naturee28099s-cin/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e449] [cursor=pointer]:
                      - button "Read more Womit fängt man eine Schottland Serie an?🤔 Das war..." [ref=e450]
                      - generic [ref=e451]:
                        - generic:
                          - generic:
                            - img "Instagram post by philipposwelt"
                        - generic [aria-hidden] [ref=e453]:
                          - generic [ref=e454]: instagram-tagged
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453b/womit-fc3a4ngt-man/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453b/womit-fc3a4ngt-man/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453b/womit-fc3a4ngt-man/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453b/womit-fc3a4ngt-man/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/26e87459f6bf72edcb54d39dd5ea93b5ddc00fd985b36b29c0d2699f.jpg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453b/womit-fc3a4ngt-man/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e458] [cursor=pointer]:
                      - 'button "Read more Kilchurn Castle, Loch Awe, Scottish Highlands #sco..." [ref=e459]'
                      - generic [ref=e460]:
                        - generic:
                          - generic:
                            - img "Instagram post by lukasz.ol_photography"
                        - generic [aria-hidden] [ref=e462]:
                          - generic [ref=e463]: instagram
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453f/kilchurn-castle2c-l/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453f/kilchurn-castle2c-l/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453f/kilchurn-castle2c-l/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453f/kilchurn-castle2c-l/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/c236c1272741462d80bbc4454fe287d678f05a58fb45e525c9517c8a.jpg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb453f/kilchurn-castle2c-l/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e467] [cursor=pointer]:
                      - button "Read more Sunrise this morning 🌅 Fun fact - these stones (P..." [ref=e468]
                      - generic [ref=e469]:
                        - generic:
                          - generic:
                            - img "Instagram post by paullittle_photography"
                        - generic [aria-hidden] [ref=e471]:
                          - generic [ref=e472]: instagram
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea44/sunrise-this-morning/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea44/sunrise-this-morning/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea44/sunrise-this-morning/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea44/sunrise-this-morning/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/67b124dd7d123d93dd5cc48b4658d1abe9b0ed7caf68dcfa8a4f93ca.jpg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea44/sunrise-this-morning/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e476] [cursor=pointer]:
                      - 'button "Read more Loch Etive Thursday night 🙋🏻‍♂️😁 . . . . . . . #..." [ref=e477]'
                      - generic [ref=e478]:
                        - generic:
                          - generic:
                            - img "Instagram post by munrodrifter"
                        - generic [aria-hidden] [ref=e480]:
                          - generic [ref=e481]: instagram-tagged
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468254/loch-etive-thursday/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468254/loch-etive-thursday/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468254/loch-etive-thursday/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468254/loch-etive-thursday/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/d035a941e5a08470b5c802b6daefdc82d27bc8da65c76b3aee59765d.jpeg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881f7e0379613de5468254/loch-etive-thursday/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e485] [cursor=pointer]:
                      - button "Read more April colours at the Ring of Brodgar 🤎 💚 In just a..." [ref=e486]
                      - generic [ref=e487]:
                        - generic:
                          - generic:
                            - img "Instagram post by visitorkney"
                        - generic [aria-hidden] [ref=e489]:
                          - generic [ref=e490]: instagram-tagged
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea43/april-colours-at-the/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea43/april-colours-at-the/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea43/april-colours-at-the/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea43/april-colours-at-the/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/3e7999b2416271f58e0708f09641d9c5d8690067fff6cb0824af6e5b.jpg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea43/april-colours-at-the/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e494] [cursor=pointer]:
                      - button "Read more Gorgeous walk around the very autumnal castle grou..." [ref=e495]
                      - generic [ref=e496]:
                        - generic:
                          - generic:
                            - img "Instagram post by wildcoast_hebrides"
                        - generic [aria-hidden] [ref=e498]:
                          - generic [ref=e499]: instagram
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4542/gorgeous-walk-around/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4542/gorgeous-walk-around/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4542/gorgeous-walk-around/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4542/gorgeous-walk-around/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/65175dff2da10d0f17c5b9d50804bc0f6bdd6dfbf4f7661265aea5f6.jpg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4542/gorgeous-walk-around/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e503] [cursor=pointer]:
                      - 'button "Read more A summer sunset for today''s #WallaceWednesday. Hop..." [ref=e504]'
                      - generic [ref=e505]:
                        - generic:
                          - generic:
                            - img "Instagram post by thekiltedphoto"
                        - generic [aria-hidden] [ref=e507]:
                          - generic [ref=e508]: instagram-tagged
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4541/a-summer-sunset-for/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4541/a-summer-sunset-for/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4541/a-summer-sunset-for/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4541/a-summer-sunset-for/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/c28eb214cb0006774f7668508a85a64d412ba2c006d31e9aa301e765.jpeg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a881edef9ad9e4b3ecb4541/a-summer-sunset-for/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e512] [cursor=pointer]:
                      - button "Read more Sunset from Gallanach Bay on the Isle of Muck. Dre..." [ref=e513]
                      - generic [ref=e514]:
                        - generic:
                          - generic:
                            - img "Instagram post by visitsmallisles"
                        - generic [aria-hidden] [ref=e516]:
                          - generic [ref=e517]: instagram
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea42/sunset-from-gallanac/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea42/sunset-from-gallanac/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea42/sunset-from-gallanac/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea42/sunset-from-gallanac/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/caa3fcc9754f64b607977fa0743d008bd01ef6e7657343297df5e1b7.jpeg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea42/sunset-from-gallanac/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e521] [cursor=pointer]:
                      - button "Read more 📍Invermoriston, Inverness, Scotland Autumn colou..." [ref=e522]
                      - generic [ref=e523]:
                        - generic:
                          - generic:
                            - img "Instagram post by adven.tureswithvivi"
                        - generic [aria-hidden] [ref=e525]:
                          - generic [ref=e526]: instagram
                          - text: i
                      - text: i
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea41/f09f938dinvermor/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea41/f09f938dinvermor/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea41/f09f938dinvermor/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea41/f09f938dinvermor/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/45eed86601386160b4443952ed2cce316d8d17638499b37593e03a07.jpeg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/6a88214d0379613de6e2ea41/f09f938dinvermor/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
                    - button [ref=e530] [cursor=pointer]:
                      - button "Read more https://www.instagram.com/p/CEFayrZH7bC/" [ref=e531]
                      - generic [ref=e532]:
                        - generic:
                          - generic:
                            - img "Asset post by leefowlie"
                        - generic: asset
                      - generic:
                        - generic:
                          - list:
                            - listitem:
                              - link "Twitter":
                                - /url: https://twitter.com/home?status=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/69207718f9ad9e28e922e5a6/https3a-wwwinstagr/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: t
                            - listitem:
                              - link "Facebook":
                                - /url: https://www.facebook.com/sharer/sharer.php?u=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/69207718f9ad9e28e922e5a6/https3a-wwwinstagr/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: o
                            - listitem:
                              - link "LinkedIn":
                                - /url: https://www.linkedin.com/shareArticle?mini=true&url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/69207718f9ad9e28e922e5a6/https3a-wwwinstagr/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&title=&summary=&source=
                                - generic [aria-hidden]: I
                            - listitem:
                              - link "Pinterest":
                                - /url: https://pinterest.com/pin/create/button/?url=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/69207718f9ad9e28e922e5a6/https3a-wwwinstagr/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx&media=https://du66ttpehq3tn.cloudfront.net/h_355,w_284,c_fill,g_auto:car/https://d1sdeqoxcfgxl0.cloudfront.net/images/original/400d4f56660340ef1066ba0c588f43541690821732ab1d3cf641b136.jpg&description=
                                - generic [aria-hidden]: p
                            - listitem:
                              - link "Email":
                                - /url: mailto:?&body=http://live.storystream.it/visitscotland/6554c56eccc80ae58e66e850/items/69207718f9ad9e28e922e5a6/https3a-wwwinstagr/?rel=on-page-gallery~MGJiMjMzOTJhZDUzZTEzMzIx
                                - generic [aria-hidden]: e
                        - generic "Close"
              - text: 
      - generic:     
      - generic [ref=e540]:
        - generic [ref=e541]:
          - heading "Join our Newsletter Clan" [level=2] [ref=e542]
          - paragraph [ref=e544]: Get Scotland inspiration direct to your inbox. Don't miss the inside track from our Scotland experts on exciting trip ideas, unique attractions and hidden gems loved by locals.
        - link "Get the Scotland newsletter" [ref=e546] [cursor=pointer]:
          - /url: /newsletter
    - contentinfo [ref=e548]:
      - generic [ref=e552]:
        - generic [ref=e554]:
          - generic [ref=e555]:
            - text: 
            - heading "Visitor information" [level=2] [ref=e556]
          - menu [ref=e558]:
            - menuitem [ref=e559]:
              - link "Test Data" [ref=e560] [cursor=pointer]:
                - /url: /test
            - menuitem [ref=e561]:
              - link "Accommodation" [ref=e562] [cursor=pointer]:
                - /url: /sandbox
        - generic [ref=e564]:
          - generic [ref=e565]:
            - text: 
            - heading "Get in touch" [level=2] [ref=e566]
          - menu [ref=e568]:
            - menuitem [ref=e569]:
              - link "Contact us" [ref=e570] [cursor=pointer]:
                - /url: /contact-us
            - menuitem [ref=e571]:
              - link "Feedback & Complaints " [ref=e572] [cursor=pointer]:
                - /url: https://www.visitscotland.org/about-us/our-policies/complaints-feedback
                - text: Feedback & Complaints
                - generic: 
            - menuitem [ref=e573]:
              - link "Submit an event" [ref=e574] [cursor=pointer]:
                - /url: /things-to-do/events/submit-event
        - generic [ref=e576]:
          - generic [ref=e577]:
            - text: 
            - heading "Our other sites" [level=2] [ref=e578]
          - menu [ref=e580]:
            - menuitem [ref=e581]:
              - link "Business Events " [ref=e582] [cursor=pointer]:
                - /url: https://businessevents.visitscotland.com/
                - text: Business Events
                - generic: 
            - menuitem [ref=e583]:
              - link "Business Support Hub " [ref=e584] [cursor=pointer]:
                - /url: https://support.visitscotland.org/
                - text: Business Support Hub
                - generic: 
            - menuitem [ref=e585]:
              - link "Travel Trade " [ref=e586] [cursor=pointer]:
                - /url: https://traveltrade.visitscotland.org/
                - text: Travel Trade
                - generic: 
            - menuitem [ref=e587]:
              - link "Asset library " [ref=e588] [cursor=pointer]:
                - /url: https://visitscotland.canto.global/v/visitscotlandassetlibrary
                - text: Asset library
                - generic: 
            - menuitem [ref=e589]:
              - link "Corporate " [ref=e590] [cursor=pointer]:
                - /url: https://www.visitscotland.org/
                - text: Corporate
                - generic: 
            - menuitem [ref=e591]:
              - link "Brand Scotland " [ref=e592] [cursor=pointer]:
                - /url: https://www.scotland.org/
                - text: Brand Scotland
                - generic: 
        - generic [ref=e594]:
          - heading "Find us on" [level=2] [ref=e595]
          - list [ref=e596]:
            - listitem [ref=e597]:
              - link "fab fa-youtube" [ref=e598] [cursor=pointer]:
                - /url: https://www.youtube.com/channel/UC1FdvQG5MFwzv0PY6dMsaFg
                - generic: 
                - text: 
            - listitem [ref=e599]:
              - link "fab fa-x-twitter" [ref=e600] [cursor=pointer]:
                - /url: https://twitter.com/VisitScotland
                - generic: 
                - text: 
            - listitem [ref=e601]:
              - link "fab fa-facebook" [ref=e602] [cursor=pointer]:
                - /url: https://www.facebook.com/visitscotland/
                - generic: 
                - text: 
            - listitem [ref=e603]:
              - link "fab fa-instagram" [ref=e604] [cursor=pointer]:
                - /url: https://www.instagram.com/visitscotland/
                - generic: 
                - text: 
      - generic:        
      - menu [ref=e609]:
        - menuitem [ref=e610]:
          - link "About us " [ref=e611] [cursor=pointer]:
            - /url: https://www.visitscotland.org/what-we-do
            - text: About us
            - generic: 
        - menuitem [ref=e612]:
          - link "Accessibility" [ref=e613] [cursor=pointer]:
            - /url: /policies/accessibility
        - menuitem [ref=e614]:
          - link "Acceptable use" [ref=e615] [cursor=pointer]:
            - /url: /policies/acceptable-use
        - menuitem [ref=e616]:
          - link "Cookies" [ref=e617] [cursor=pointer]:
            - /url: /policies/privacy/cookies
        - menuitem [ref=e618]:
          - link "Environmental policy" [ref=e619] [cursor=pointer]:
            - /url: /policies/environmental
        - menuitem [ref=e620]:
          - link "Privacy " [ref=e621] [cursor=pointer]:
            - /url: https://www.visitscotland.org/what-we-do/privacy-centre
            - text: Privacy
            - generic: 
        - menuitem [ref=e622]:
          - link "Social media" [ref=e623] [cursor=pointer]:
            - /url: /policies/terms-conditions/social-media
        - menuitem [ref=e624]:
          - link "Terms of use" [ref=e625] [cursor=pointer]:
            - /url: /policies/terms-conditions
      - generic [ref=e629]:
        - link "Brand Scotland":
          - /url: https://www.scotland.org/
        - paragraph [ref=e631]: © 2026 VisitScotland. All rights reserved.
  - generic [ref=e632]:
    - button "Toggle Nuxt DevTools" [ref=e633] [cursor=pointer]
    - generic "App load time" [ref=e637]:
      - generic [ref=e638]: "4.7"
      - generic [ref=e639]: s
    - button "Toggle Component Inspector" [ref=e641] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { resolve } from 'node:path';
  3  | import { apps } from './pages.config';
  4  | import { mockBloomreachApi, waitForHydration } from './utils/mock-bloomreach.ts';
  5  | 
  6  | for (const app of apps) {
  7  |     test.describe(app.name, () => {
  8  |         for (const page of app.pages) {
  9  |             test(`visual regression: ${page.name}`, async({ page: browserPage }, testInfo) => {
  10 |                 test.skip(testInfo.project.name !== app.name, 'Skipping: not the current project');
  11 | 
  12 |                 const piniaErrors: string[] = [];
  13 |                 browserPage.on('pageerror', (error) => {
  14 |                     if (/pinia|storeToRefs/i.test(error.message)) {
  15 |                         piniaErrors.push(error.message);
  16 |                     }
  17 |                 });
  18 | 
  19 |                 const fixturePath = resolve(
  20 |                     process.cwd(),
  21 |                     app.fixtureDir,
  22 |                     page.fixtureFile,
  23 |                 );
  24 | 
  25 |                 await mockBloomreachApi(browserPage, {
  26 |                     endpoint: app.bloomreachEndpoint,
  27 |                     fixturePath,
  28 |                 });
  29 | 
  30 |                 await browserPage.route('**/api/getEndpoint', (route) =>
  31 |                     route.fulfill({
  32 |                         status: 200,
  33 |                         contentType: 'text/plain',
  34 |                         body: `https://${app.bloomreachEndpoint}/resourceapi`,
  35 |                     }),
  36 |                 );
  37 |                 await browserPage.route('**/api/getXForwardedHost', (route) =>
  38 |                     route.fulfill({
  39 |                         status: 200,
  40 |                         contentType: 'text/plain',
  41 |                         body: '',
  42 |                     }),
  43 |                 );
  44 | 
  45 |                 await browserPage.goto(page.path, {
  46 |                     waitUntil: 'domcontentloaded',
  47 |                 });
  48 | 
  49 |                 await waitForHydration(browserPage);
  50 |                 await expect(browserPage.locator('.hydrate')).toBeVisible();
  51 |                 expect(piniaErrors).toEqual([]);
  52 | 
> 53 |                 await expect(browserPage).toHaveScreenshot(
     |                                           ^ Error: expect(page).toHaveScreenshot(expected) failed
  54 |                     `${page.name.toLowerCase().replace(/\s+/g, '-')}.png`,
  55 |                     {
  56 |                         fullPage: true,
  57 |                     },
  58 |                 );
  59 |             });
  60 |         }
  61 |     });
  62 | }
  63 | 
```