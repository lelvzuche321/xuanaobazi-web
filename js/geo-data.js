/**
 * Global City Geo Data - Longitude, Latitude, Timezone
 * 全球城市经纬度与时区数据
 */
const GeoData = (function() {
    'use strict';

    const CONTINENTS = {
        asia: { name: 'Asia', cn: '亚洲', emoji: '🌏' },
        europe: { name: 'Europe', cn: '欧洲', emoji: '🌍' },
        northAmerica: { name: 'North America', cn: '北美洲', emoji: '🌎' },
        southAmerica: { name: 'South America', cn: '南美洲', emoji: '🌎' },
        africa: { name: 'Africa', cn: '非洲', emoji: '🌍' },
        oceania: { name: 'Oceania', cn: '大洋洲', emoji: '🏝️' },
        middleEast: { name: 'Middle East', cn: '中东', emoji: '🕌' }
    };

    const CITIES = [
        // Asia
        { city: 'Beijing', cn: '北京', country: 'China', cn_country: '中国', lon: 116.40, lat: 39.90, tz: 'Asia/Shanghai', continent: 'asia' },
        { city: 'Shanghai', cn: '上海', country: 'China', cn_country: '中国', lon: 121.47, lat: 31.23, tz: 'Asia/Shanghai', continent: 'asia' },
        { city: 'Hong Kong', cn: '香港', country: 'China', cn_country: '中国', lon: 114.17, lat: 22.30, tz: 'Asia/Hong_Kong', continent: 'asia' },
        { city: 'Taipei', cn: '台北', country: 'Taiwan', cn_country: '台湾', lon: 121.53, lat: 25.03, tz: 'Asia/Taipei', continent: 'asia' },
        { city: 'Tokyo', cn: '东京', country: 'Japan', cn_country: '日本', lon: 139.69, lat: 35.69, tz: 'Asia/Tokyo', continent: 'asia' },
        { city: 'Osaka', cn: '大阪', country: 'Japan', cn_country: '日本', lon: 135.50, lat: 34.69, tz: 'Asia/Tokyo', continent: 'asia' },
        { city: 'Seoul', cn: '首尔', country: 'South Korea', cn_country: '韩国', lon: 126.98, lat: 37.57, tz: 'Asia/Seoul', continent: 'asia' },
        { city: 'Busan', cn: '釜山', country: 'South Korea', cn_country: '韩国', lon: 129.08, lat: 35.18, tz: 'Asia/Seoul', continent: 'asia' },
        { city: 'Singapore', cn: '新加坡', country: 'Singapore', cn_country: '新加坡', lon: 103.85, lat: 1.29, tz: 'Asia/Singapore', continent: 'asia' },
        { city: 'Kuala Lumpur', cn: '吉隆坡', country: 'Malaysia', cn_country: '马来西亚', lon: 101.69, lat: 3.14, tz: 'Asia/Kuala_Lumpur', continent: 'asia' },
        { city: 'Bangkok', cn: '曼谷', country: 'Thailand', cn_country: '泰国', lon: 100.50, lat: 13.75, tz: 'Asia/Bangkok', continent: 'asia' },
        { city: 'Jakarta', cn: '雅加达', country: 'Indonesia', cn_country: '印尼', lon: 106.85, lat: -6.21, tz: 'Asia/Jakarta', continent: 'asia' },
        { city: 'Manila', cn: '马尼拉', country: 'Philippines', cn_country: '菲律宾', lon: 120.98, lat: 14.60, tz: 'Asia/Manila', continent: 'asia' },
        { city: 'Hanoi', cn: '河内', country: 'Vietnam', cn_country: '越南', lon: 105.85, lat: 21.03, tz: 'Asia/Ho_Chi_Minh', continent: 'asia' },
        { city: 'Ho Chi Minh City', cn: '胡志明市', country: 'Vietnam', cn_country: '越南', lon: 106.63, lat: 10.82, tz: 'Asia/Ho_Chi_Minh', continent: 'asia' },
        { city: 'New Delhi', cn: '新德里', country: 'India', cn_country: '印度', lon: 77.21, lat: 28.61, tz: 'Asia/Kolkata', continent: 'asia' },
        { city: 'Mumbai', cn: '孟买', country: 'India', cn_country: '印度', lon: 72.88, lat: 19.08, tz: 'Asia/Kolkata', continent: 'asia' },
        { city: 'Bangalore', cn: '班加罗尔', country: 'India', cn_country: '印度', lon: 77.59, lat: 12.97, tz: 'Asia/Kolkata', continent: 'asia' },
        { city: 'Yangon', cn: '仰光', country: 'Myanmar', cn_country: '缅甸', lon: 96.16, lat: 16.87, tz: 'Asia/Yangon', continent: 'asia' },
        { city: 'Phnom Penh', cn: '金边', country: 'Cambodia', cn_country: '柬埔寨', lon: 104.92, lat: 11.56, tz: 'Asia/Phnom_Penh', continent: 'asia' },
        { city: 'Islamabad', cn: '伊斯兰堡', country: 'Pakistan', cn_country: '巴基斯坦', lon: 73.05, lat: 33.68, tz: 'Asia/Karachi', continent: 'asia' },
        { city: 'Karachi', cn: '卡拉奇', country: 'Pakistan', cn_country: '巴基斯坦', lon: 67.00, lat: 24.86, tz: 'Asia/Karachi', continent: 'asia' },
        { city: 'Dhaka', cn: '达卡', country: 'Bangladesh', cn_country: '孟加拉国', lon: 90.41, lat: 23.81, tz: 'Asia/Dhaka', continent: 'asia' },
        { city: 'Colombo', cn: '科伦坡', country: 'Sri Lanka', cn_country: '斯里兰卡', lon: 79.86, lat: 6.93, tz: 'Asia/Colombo', continent: 'asia' },
        { city: 'Kathmandu', cn: '加德满都', country: 'Nepal', cn_country: '尼泊尔', lon: 85.32, lat: 27.72, tz: 'Asia/Kathmandu', continent: 'asia' },
        { city: 'Ulaanbaatar', cn: '乌兰巴托', country: 'Mongolia', cn_country: '蒙古', lon: 106.92, lat: 47.92, tz: 'Asia/Ulaanbaatar', continent: 'asia' },
        { city: 'Almaty', cn: '阿拉木图', country: 'Kazakhstan', cn_country: '哈萨克斯坦', lon: 76.93, lat: 43.26, tz: 'Asia/Almaty', continent: 'asia' },

        // Middle East
        { city: 'Dubai', cn: '迪拜', country: 'UAE', cn_country: '阿联酋', lon: 55.27, lat: 25.20, tz: 'Asia/Dubai', continent: 'middleEast' },
        { city: 'Abu Dhabi', cn: '阿布扎比', country: 'UAE', cn_country: '阿联酋', lon: 54.37, lat: 24.45, tz: 'Asia/Dubai', continent: 'middleEast' },
        { city: 'Riyadh', cn: '利雅得', country: 'Saudi Arabia', cn_country: '沙特', lon: 46.72, lat: 24.71, tz: 'Asia/Riyadh', continent: 'middleEast' },
        { city: 'Doha', cn: '多哈', country: 'Qatar', cn_country: '卡塔尔', lon: 51.53, lat: 25.29, tz: 'Asia/Qatar', continent: 'middleEast' },
        { city: 'Tehran', cn: '德黑兰', country: 'Iran', cn_country: '伊朗', lon: 51.39, lat: 35.69, tz: 'Asia/Tehran', continent: 'middleEast' },
        { city: 'Istanbul', cn: '伊斯坦布尔', country: 'Turkey', cn_country: '土耳其', lon: 28.98, lat: 41.01, tz: 'Europe/Istanbul', continent: 'middleEast' },
        { city: 'Tel Aviv', cn: '特拉维夫', country: 'Israel', cn_country: '以色列', lon: 34.78, lat: 32.09, tz: 'Asia/Jerusalem', continent: 'middleEast' },
        { city: 'Baghdad', cn: '巴格达', country: 'Iraq', cn_country: '伊拉克', lon: 44.37, lat: 33.32, tz: 'Asia/Baghdad', continent: 'middleEast' },
        { city: 'Kuwait City', cn: '科威特城', country: 'Kuwait', cn_country: '科威特', lon: 47.98, lat: 29.38, tz: 'Asia/Kuwait', continent: 'middleEast' },
        { city: 'Muscat', cn: '马斯喀特', country: 'Oman', cn_country: '阿曼', lon: 58.59, lat: 23.59, tz: 'Asia/Muscat', continent: 'middleEast' },

        // Europe
        { city: 'London', cn: '伦敦', country: 'United Kingdom', cn_country: '英国', lon: -0.13, lat: 51.51, tz: 'Europe/London', continent: 'europe' },
        { city: 'Manchester', cn: '曼彻斯特', country: 'United Kingdom', cn_country: '英国', lon: -2.24, lat: 53.48, tz: 'Europe/London', continent: 'europe' },
        { city: 'Paris', cn: '巴黎', country: 'France', cn_country: '法国', lon: 2.35, lat: 48.86, tz: 'Europe/Paris', continent: 'europe' },
        { city: 'Berlin', cn: '柏林', country: 'Germany', cn_country: '德国', lon: 13.41, lat: 52.52, tz: 'Europe/Berlin', continent: 'europe' },
        { city: 'Munich', cn: '慕尼黑', country: 'Germany', cn_country: '德国', lon: 11.58, lat: 48.14, tz: 'Europe/Berlin', continent: 'europe' },
        { city: 'Madrid', cn: '马德里', country: 'Spain', cn_country: '西班牙', lon: -3.70, lat: 40.42, tz: 'Europe/Madrid', continent: 'europe' },
        { city: 'Barcelona', cn: '巴塞罗那', country: 'Spain', cn_country: '西班牙', lon: 2.17, lat: 41.39, tz: 'Europe/Madrid', continent: 'europe' },
        { city: 'Rome', cn: '罗马', country: 'Italy', cn_country: '意大利', lon: 12.50, lat: 41.90, tz: 'Europe/Rome', continent: 'europe' },
        { city: 'Milan', cn: '米兰', country: 'Italy', cn_country: '意大利', lon: 9.19, lat: 45.46, tz: 'Europe/Rome', continent: 'europe' },
        { city: 'Amsterdam', cn: '阿姆斯特丹', country: 'Netherlands', cn_country: '荷兰', lon: 4.90, lat: 52.37, tz: 'Europe/Amsterdam', continent: 'europe' },
        { city: 'Brussels', cn: '布鲁塞尔', country: 'Belgium', cn_country: '比利时', lon: 4.35, lat: 50.85, tz: 'Europe/Brussels', continent: 'europe' },
        { city: 'Zurich', cn: '苏黎世', country: 'Switzerland', cn_country: '瑞士', lon: 8.54, lat: 47.38, tz: 'Europe/Zurich', continent: 'europe' },
        { city: 'Vienna', cn: '维也纳', country: 'Austria', cn_country: '奥地利', lon: 16.37, lat: 48.21, tz: 'Europe/Vienna', continent: 'europe' },
        { city: 'Prague', cn: '布拉格', country: 'Czech Republic', cn_country: '捷克', lon: 14.44, lat: 50.09, tz: 'Europe/Prague', continent: 'europe' },
        { city: 'Warsaw', cn: '华沙', country: 'Poland', cn_country: '波兰', lon: 21.01, lat: 52.23, tz: 'Europe/Warsaw', continent: 'europe' },
        { city: 'Moscow', cn: '莫斯科', country: 'Russia', cn_country: '俄罗斯', lon: 37.62, lat: 55.75, tz: 'Europe/Moscow', continent: 'europe' },
        { city: 'Stockholm', cn: '斯德哥尔摩', country: 'Sweden', cn_country: '瑞典', lon: 18.07, lat: 59.33, tz: 'Europe/Stockholm', continent: 'europe' },
        { city: 'Oslo', cn: '奥斯陆', country: 'Norway', cn_country: '挪威', lon: 10.75, lat: 59.91, tz: 'Europe/Oslo', continent: 'europe' },
        { city: 'Copenhagen', cn: '哥本哈根', country: 'Denmark', cn_country: '丹麦', lon: 12.57, lat: 55.68, tz: 'Europe/Copenhagen', continent: 'europe' },
        { city: 'Helsinki', cn: '赫尔辛基', country: 'Finland', cn_country: '芬兰', lon: 24.94, lat: 60.17, tz: 'Europe/Helsinki', continent: 'europe' },
        { city: 'Lisbon', cn: '里斯本', country: 'Portugal', cn_country: '葡萄牙', lon: -9.14, lat: 38.72, tz: 'Europe/Lisbon', continent: 'europe' },
        { city: 'Athens', cn: '雅典', country: 'Greece', cn_country: '希腊', lon: 23.73, lat: 37.98, tz: 'Europe/Athens', continent: 'europe' },
        { city: 'Budapest', cn: '布达佩斯', country: 'Hungary', cn_country: '匈牙利', lon: 19.04, lat: 47.50, tz: 'Europe/Budapest', continent: 'europe' },
        { city: 'Dublin', cn: '都柏林', country: 'Ireland', cn_country: '爱尔兰', lon: -6.26, lat: 53.35, tz: 'Europe/Dublin', continent: 'europe' },
        { city: 'Kyiv', cn: '基辅', country: 'Ukraine', cn_country: '乌克兰', lon: 30.52, lat: 50.45, tz: 'Europe/Kyiv', continent: 'europe' },
        { city: 'Bucharest', cn: '布加勒斯特', country: 'Romania', cn_country: '罗马尼亚', lon: 26.10, lat: 44.43, tz: 'Europe/Bucharest', continent: 'europe' },
        { city: 'Belgrade', cn: '贝尔格莱德', country: 'Serbia', cn_country: '塞尔维亚', lon: 20.46, lat: 44.82, tz: 'Europe/Belgrade', continent: 'europe' },

        // North America
        { city: 'New York', cn: '纽约', country: 'United States', cn_country: '美国', lon: -74.01, lat: 40.71, tz: 'America/New_York', continent: 'northAmerica' },
        { city: 'Los Angeles', cn: '洛杉矶', country: 'United States', cn_country: '美国', lon: -118.24, lat: 34.05, tz: 'America/Los_Angeles', continent: 'northAmerica' },
        { city: 'Chicago', cn: '芝加哥', country: 'United States', cn_country: '美国', lon: -87.63, lat: 41.88, tz: 'America/Chicago', continent: 'northAmerica' },
        { city: 'Houston', cn: '休斯顿', country: 'United States', cn_country: '美国', lon: -95.37, lat: 29.76, tz: 'America/Chicago', continent: 'northAmerica' },
        { city: 'San Francisco', cn: '旧金山', country: 'United States', cn_country: '美国', lon: -122.42, lat: 37.77, tz: 'America/Los_Angeles', continent: 'northAmerica' },
        { city: 'Seattle', cn: '西雅图', country: 'United States', cn_country: '美国', lon: -122.33, lat: 47.61, tz: 'America/Los_Angeles', continent: 'northAmerica' },
        { city: 'Miami', cn: '迈阿密', country: 'United States', cn_country: '美国', lon: -80.19, lat: 25.76, tz: 'America/New_York', continent: 'northAmerica' },
        { city: 'Boston', cn: '波士顿', country: 'United States', cn_country: '美国', lon: -71.06, lat: 42.36, tz: 'America/New_York', continent: 'northAmerica' },
        { city: 'Las Vegas', cn: '拉斯维加斯', country: 'United States', cn_country: '美国', lon: -115.14, lat: 36.17, tz: 'America/Los_Angeles', continent: 'northAmerica' },
        { city: 'Washington DC', cn: '华盛顿', country: 'United States', cn_country: '美国', lon: -77.04, lat: 38.91, tz: 'America/New_York', continent: 'northAmerica' },
        { city: 'Toronto', cn: '多伦多', country: 'Canada', cn_country: '加拿大', lon: -79.38, lat: 43.65, tz: 'America/Toronto', continent: 'northAmerica' },
        { city: 'Vancouver', cn: '温哥华', country: 'Canada', cn_country: '加拿大', lon: -123.12, lat: 49.28, tz: 'America/Vancouver', continent: 'northAmerica' },
        { city: 'Montreal', cn: '蒙特利尔', country: 'Canada', cn_country: '加拿大', lon: -73.57, lat: 45.50, tz: 'America/Montreal', continent: 'northAmerica' },
        { city: 'Mexico City', cn: '墨西哥城', country: 'Mexico', cn_country: '墨西哥', lon: -99.13, lat: 19.43, tz: 'America/Mexico_City', continent: 'northAmerica' },
        { city: 'Panama City', cn: '巴拿马城', country: 'Panama', cn_country: '巴拿马', lon: -79.52, lat: 8.98, tz: 'America/Panama', continent: 'northAmerica' },
        { city: 'Havana', cn: '哈瓦那', country: 'Cuba', cn_country: '古巴', lon: -82.37, lat: 23.11, tz: 'America/Havana', continent: 'northAmerica' },

        // South America
        { city: 'São Paulo', cn: '圣保罗', country: 'Brazil', cn_country: '巴西', lon: -46.63, lat: -23.55, tz: 'America/Sao_Paulo', continent: 'southAmerica' },
        { city: 'Rio de Janeiro', cn: '里约热内卢', country: 'Brazil', cn_country: '巴西', lon: -43.20, lat: -22.91, tz: 'America/Sao_Paulo', continent: 'southAmerica' },
        { city: 'Buenos Aires', cn: '布宜诺斯艾利斯', country: 'Argentina', cn_country: '阿根廷', lon: -58.38, lat: -34.60, tz: 'America/Argentina/Buenos_Aires', continent: 'southAmerica' },
        { city: 'Santiago', cn: '圣地亚哥', country: 'Chile', cn_country: '智利', lon: -70.65, lat: -33.45, tz: 'America/Santiago', continent: 'southAmerica' },
        { city: 'Lima', cn: '利马', country: 'Peru', cn_country: '秘鲁', lon: -77.03, lat: -12.05, tz: 'America/Lima', continent: 'southAmerica' },
        { city: 'Bogotá', cn: '波哥大', country: 'Colombia', cn_country: '哥伦比亚', lon: -74.08, lat: 4.71, tz: 'America/Bogota', continent: 'southAmerica' },
        { city: 'Caracas', cn: '加拉加斯', country: 'Venezuela', cn_country: '委内瑞拉', lon: -66.90, lat: 10.48, tz: 'America/Caracas', continent: 'southAmerica' },

        // Africa
        { city: 'Cairo', cn: '开罗', country: 'Egypt', cn_country: '埃及', lon: 31.24, lat: 30.04, tz: 'Africa/Cairo', continent: 'africa' },
        { city: 'Lagos', cn: '拉各斯', country: 'Nigeria', cn_country: '尼日利亚', lon: 3.38, lat: 6.45, tz: 'Africa/Lagos', continent: 'africa' },
        { city: 'Johannesburg', cn: '约翰内斯堡', country: 'South Africa', cn_country: '南非', lon: 28.05, lat: -26.20, tz: 'Africa/Johannesburg', continent: 'africa' },
        { city: 'Cape Town', cn: '开普敦', country: 'South Africa', cn_country: '南非', lon: 18.42, lat: -33.92, tz: 'Africa/Johannesburg', continent: 'africa' },
        { city: 'Nairobi', cn: '内罗毕', country: 'Kenya', cn_country: '肯尼亚', lon: 36.82, lat: -1.29, tz: 'Africa/Nairobi', continent: 'africa' },
        { city: 'Casablanca', cn: '卡萨布兰卡', country: 'Morocco', cn_country: '摩洛哥', lon: -7.59, lat: 33.57, tz: 'Africa/Casablanca', continent: 'africa' },
        { city: 'Addis Ababa', cn: '亚的斯亚贝巴', country: 'Ethiopia', cn_country: '埃塞俄比亚', lon: 38.75, lat: 9.03, tz: 'Africa/Addis_Ababa', continent: 'africa' },
        { city: 'Accra', cn: '阿克拉', country: 'Ghana', cn_country: '加纳', lon: -0.19, lat: 5.60, tz: 'Africa/Accra', continent: 'africa' },
        { city: 'Dar es Salaam', cn: '达累斯萨拉姆', country: 'Tanzania', cn_country: '坦桑尼亚', lon: 39.27, lat: -6.79, tz: 'Africa/Dar_es_Salaam', continent: 'africa' },
        { city: 'Algiers', cn: '阿尔及尔', country: 'Algeria', cn_country: '阿尔及利亚', lon: 3.06, lat: 36.75, tz: 'Africa/Algiers', continent: 'africa' },

        // Oceania
        { city: 'Sydney', cn: '悉尼', country: 'Australia', cn_country: '澳大利亚', lon: 151.21, lat: -33.87, tz: 'Australia/Sydney', continent: 'oceania' },
        { city: 'Melbourne', cn: '墨尔本', country: 'Australia', cn_country: '澳大利亚', lon: 144.96, lat: -37.81, tz: 'Australia/Melbourne', continent: 'oceania' },
        { city: 'Brisbane', cn: '布里斯班', country: 'Australia', cn_country: '澳大利亚', lon: 153.03, lat: -27.47, tz: 'Australia/Brisbane', continent: 'oceania' },
        { city: 'Perth', cn: '珀斯', country: 'Australia', cn_country: '澳大利亚', lon: 115.86, lat: -31.95, tz: 'Australia/Perth', continent: 'oceania' },
        { city: 'Auckland', cn: '奥克兰', country: 'New Zealand', cn_country: '新西兰', lon: 174.76, lat: -36.85, tz: 'Pacific/Auckland', continent: 'oceania' },
        { city: 'Wellington', cn: '惠灵顿', country: 'New Zealand', cn_country: '新西兰', lon: 174.78, lat: -41.29, tz: 'Pacific/Auckland', continent: 'oceania' }
    ];

    function getCitiesByContinent(continent) {
        return CITIES.filter(c => c.continent === continent);
    }

    function findCity(query) {
        if (!query) return null;
        const q = query.toLowerCase();
        return CITIES.find(c =>
            c.city.toLowerCase() === q ||
            c.cn === q ||
            (c.city + ', ' + c.country).toLowerCase() === q
        );
    }

    return {
        CITIES,
        CONTINENTS,
        getCitiesByContinent,
        findCity
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoData;
}