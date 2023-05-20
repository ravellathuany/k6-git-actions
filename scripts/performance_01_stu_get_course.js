import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '20s', target: 350 },
        { duration: '10m', target: 350 }, //duration: '10m', target: 400
        { duration: '10s', target: 0 }
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
    }
}

export default function(){
    //const BASE_URL = 'https://3.92.182.37:8080';
    const BASE_URL = 'http://monitoria.icomp.ufam.edu.br';

    const res = http.get(`${BASE_URL}/course`);

    check(res, {
        'status code 200': (r) => r.status === 200
    });

    sleep(1);
}
export function handleSummary(data) {
    return {
      "PT_01_stu_get_course_ufam.html": htmlReport(data),
      //"PT_01_stu_get_course_staging.html": htmlReport(data),
    };
}