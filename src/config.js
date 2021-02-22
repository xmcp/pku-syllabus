export const SEMESTER={
    name: '2020-2021 第二学期',
    id: '2020-2021 sem2', // checked before importing
    begin_date: new Date(2021,3-1,8, 0,0,0,0),
    weeks: 15,
    exclude_dates: [
        new Date(2021,4-1,30, 0,0,0,0), // 4 月 30 日，补休，全校停课。
        new Date(2021,5-1,1, 0,0,0,0), // 5 月 1 日劳动节，放假，全校停课
    ]
};

export const DATA_VER='data_v3';