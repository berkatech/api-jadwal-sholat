import got from "got";

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
    if (!params.province_id || !params.city_id || !params.month || !params.year) {
        throw new Error('Missing required parameters');
    }

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