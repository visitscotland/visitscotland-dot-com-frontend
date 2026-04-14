// // returns feature flag values from the AppConfig agent
// 

const featureFlagsData = (axios, input: string): string => {
    console.log('TEST')

    let featureFlagsData = {};

    axios.get('http://172.28.63.17:2772/applications/visitscotland.com/environments/local/configurations/ttalfx1')
        .then(function (response) {
            console.log('feature flags data fetched successfully', response.data);
            // handle success
            featureFlagsData = response;
        })
        .catch(function (error) {
            // handle error
            console.log('error fetching feature flags data', error); 
        });

    }




export default featureFlagsData;

