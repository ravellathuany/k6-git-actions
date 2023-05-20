import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '20s', target: 350 },
        { duration: '10m', target: 350 }, //10m
        { duration: '10s', target: 0 }
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250'] //3000
    }
}

//const BASE_URL = 'https://3.92.182.37:8080';
const BASE_URL = 'http://monitoria.icomp.ufam.edu.br';

export function setup() {
    const loginRes = http.post(`${BASE_URL}/auth/login`, {
        email: 'ravella@icomp.ufam.edu.br',
        password: '12345678'
    });
    const token = loginRes.json('access_token');
    return token;
}

export default function(token) {
    const params = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    const res = http.get(`${BASE_URL}/monitor/availability/9`, params);

    check(res, {
        'status code 200': (r) => r.status === 200
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
      "PT_01_stu_get_monitor_avai_monId_ufam.html": htmlReport(data),
      //"PT_01_stu_get_monitor_avai_monId_staging.html": htmlReport(data),
    };
}