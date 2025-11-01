import got from "got";
import { JSDOM } from 'jsdom';

export const getCookies = async () => {
    const page = await got.get('https://bimasislam.kemenag.go.id', {
        timeout: {
            request: 7000,
        },
        retry: {
            limit: 2
        }
    });
    const cookies = page.headers['set-cookie'] || [];
    return cookies.join("; ");
}

interface getScheduleParams {
    province_id: string | null
    city_id: string | null
    month: string | null
    year: string | null
}

interface getScheduleResponse {
    data: {
        [date: string]: {
            tanggal: string,
            ashar: string,
            dhuha: string,
            dzuhur: string,
            imsak: string,
            isya: string,
            maghrib: string,
            subuh: string,
            terbit: string,
        }
    }
    prov: string,
    kabko: string,
}

export const getSchedules = async (params: getScheduleParams) => {
    const cookies = await getCookies();

    // get schedule
    const schedules: getScheduleResponse = await got.post('https://bimasislam.kemenag.go.id/web/ajax/getShalatbln', {
        form: {
            x: params.province_id,
            y: params.city_id,
            bln: params.month,
            thn: params.year,
        },
        headers: {
            'Cookie': cookies
        },
        timeout: {
            request: 10000,
        },
        retry: {
            limit: 2
        }
    }).json();

    return schedules;
}

export const getProvinces = async () => {
    const cookies = await getCookies();

    const page = await got.get('https://bimasislam.kemenag.go.id/web/jadwalshalat', {
        headers: {
            'Cookie': cookies
        }
    });

    const dom = new JSDOM(page.body).window;

    const selectorTag = dom.document.getElementById('search_prov')!;
    const provinceTags = selectorTag.querySelectorAll('option');

    const provinces: Array<{
        id: string,
        name: string
    }> = [];

    for (let i = 0; i < provinceTags.length; i++) {
        const element = provinceTags[i];

        if (!element.value) continue;

        provinces.push({
            id: element.value,
            name: element.text,
        });
    }

    return provinces;

}