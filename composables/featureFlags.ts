// get feature flags from the backend and return them
const featureFlagsData = await $fetch('/api/frontend/aws/flag-authentication');

export default featureFlagsData;