export function describe_time(co) {
    return (
        `${co.begin_week}~${co.end_week}周`+
        ` ${{'all': '每', 'odd': '单', 'even': '双'}[co.every]}周${'啊一二三四五六日'[co.weekday]}`+
        ` ${co.begin_time}~${co.end_time}节`
    );
}