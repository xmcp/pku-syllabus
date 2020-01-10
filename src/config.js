export const SEMESTER={
    name: '2019-2020 第二学期',
    id: '2019-2020 sem2', // checked before importing
    begin_date: new Date(2020,2-1,17, 0,0,0,0),
    weeks: 16,
    exclude_dates: [
        new Date(2020,4-1,24, 0,0,0,0), // 运动会
        new Date(2020,5-1,1, 0,0,0,0), // 五一
        new Date(2020,5-1,4, 0,0,0,0),
        new Date(2020,5-1,5, 0,0,0,0),
        new Date(2020,5-1,6, 0,0,0,0),
        new Date(2020,5-1,7, 0,0,0,0),
        new Date(2020,5-1,8, 0,0,0,0),
    ]
};

export const DATA_VER='data_v3';