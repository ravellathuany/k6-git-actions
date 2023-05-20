import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '5s', target: 100 },
        { duration: '1m', target: 100 },
        { duration: '5s', target: 0 }
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
    }
}

export default function(){
    const BASE_URL = 'https://3.92.182.37:8080';

    const res = http.get(`${BASE_URL}/code/type-code`);

    check(res, {
        'status code 200': (r) => r.status === 200
    });

    sleep(1);
}