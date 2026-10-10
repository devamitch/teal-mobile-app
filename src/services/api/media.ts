import axios, {CancelTokenSource} from 'axios';

const API_URL =
  'https://drsqevma67m3r53t3qeu4pak4m0siaue.lambda-url.ca-central-1.on.aws';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

export const mediaApiClient = {
  source: null as CancelTokenSource | null,

  async fetchMedia() {
    this.cancelRequest();

    this.source = axios.CancelToken.source();

    try {
      const response = await axios.get(API_URL, {
        params: {ApiKey: API_KEY},
        cancelToken: this.source.token,
      });

      console.log('=== CDN API Raw Response ===');
      console.log('CDN API Response:', JSON.stringify(response.data, null, 2));

      // Enhanced logging for CDN analysis
      if (response.data && response.data.list) {
        console.log('=== CDN Media Analysis ===');
        console.log(`Total items in CDN: ${response.data.list.length}`);

        // Group by folder/path for better understanding
        const folderCounts = response.data.list.reduce(
          (acc: any, item: any) => {
            const folder = item.Key ? item.Key.split('/')[0] : 'root';
            acc[folder] = (acc[folder] || 0) + 1;
            return acc;
          },
          {},
        );

        console.log('Items by folder:', folderCounts);

        // Show sample of items
        console.log('=== Sample CDN Items ===');
        response.data.list.slice(0, 10).forEach((item: any, index: number) => {
          console.log(`Sample ${index + 1}:`, {
            Key: item.Key,
            Size: item.Size,
            LastModified: item.LastModified,
            ETag: item.ETag,
          });
        });

        // Filter for "My Teal" items to see what will be processed
        const myTealItems = response.data.list.filter(
          (item: any) => item.Key && item.Key.includes('My Teal'),
        );
        console.log(`\nItems containing "My Teal": ${myTealItems.length}`);
        myTealItems.forEach((item: any, index: number) => {
          console.log(`My Teal ${index + 1}:`, item.Key);
        });

        console.log('=== End CDN Analysis ===');
      }

      return response.data || {list: []};
    } catch (err) {
      if (!axios.isCancel(err)) {
        throw err;
      }
      return {list: []};
    }
  },

  cancelRequest() {
    if (this.source) {
      this.source.cancel('Request canceled');
      this.source = null;
    }
  },
};
