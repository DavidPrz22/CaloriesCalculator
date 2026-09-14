import foodinfoClient from '../nodeApp/apis/foodApi/api.js';
const fdc_id = process.argv[2];
const request = async (fcdId) => {
    try {
        const res = await foodinfoClient.get(`/v1/food/${fcdId}`);
        console.log(`/v1/food/${fcdId}`);
        console.log(res.data);
    }
    catch (e) {
        console.error('Request failed', e);
    }
};
await request(Number(fdc_id));
//# sourceMappingURL=fdc_api_item.js.map