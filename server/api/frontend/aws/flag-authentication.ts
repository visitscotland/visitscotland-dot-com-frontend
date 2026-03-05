console.log('authentication file');
import {
    AppConfigDataClient,
    BadRequestException,
    GetLatestConfigurationCommand,
    StartConfigurationSessionCommand,
  } from '@aws-sdk/client-appconfigdata';

export default defineEventHandler(async(event) => {
    // a client can be shared by different commands.
    const client = new AppConfigDataClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken:  process.env.AWS_SESSION_TOKEN,
    },
    });

    let existingToken;

    const getToken = async () => {
      try {
        const getSession = new StartConfigurationSessionCommand({
          ApplicationIdentifier: process.env.APP_CONFIG_APP_IDENTIFIER,
          ConfigurationProfileIdentifier: process.env.APP_CONFIG_CONFIG_PROFILE_IDENTIFIER,
          EnvironmentIdentifier: process.env.APP_CONFIG_ENVIRONMENT_IDENTIFIER,
        });
    
        // Attempt to send the command and handle the response
        const sessionToken = await client.send(getSession);
    
        // Check if the response contains the token
        return sessionToken.InitialConfigurationToken || '';
      } catch (error) {
        // Log the error and return an empty string
        console.error('Error in StartConfigurationSessionCommand:', error);
        return '';
      }
    };

    const getFeatureFlags = async () => {
        if (!existingToken) {
          existingToken = await getToken();
        }

        if (existingToken === '') {
          console.log('Failed to retrieve token. Returning empty flags.');
          return {}; // Return an empty object if token retrieval failed
        }

        try {
          const command = new GetLatestConfigurationCommand({
            ConfigurationToken: existingToken,
          });
          const response = await client.send(command);
          let flags = {};
          if (response.Configuration) {
            let str = '';
            for (let i = 0; i < response.Configuration.length; i++) {
              str += String.fromCharCode(response.Configuration[i]);
            }
            const allFlag = JSON.parse(str);
            flags = Object.assign({}, allFlag);
          }
          return flags;
      
        } catch (err) {
            console.log('ERRORS', err);
          if (err instanceof BadRequestException) {
            existingToken = await getToken();
            // recall
            return featureFlag(flagKey);
          } else {
            throw err;
          }
        }
    };

    const flags = await getFeatureFlags();

    return flags;
});


  