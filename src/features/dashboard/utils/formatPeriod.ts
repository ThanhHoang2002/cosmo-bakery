export const formatPeriod = (period: string) => {
    const periodMap: Record<string, string> = {
        today: 'Hôm nay',
        week: 'Tuần này',
        month: 'Tháng này',
        year: 'Năm này',
    };
    return periodMap[period] || period;
};
