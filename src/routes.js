import React, {Component, PureComponent} from 'react';
import {PageHeader} from 'antd';

import {Homepage} from './homepage/Homepage';
import {ImportElective} from './import/ImportElective';
import {ImportIsop} from './import/ImportIsop';
import {ImportConfig} from './import/ImportConfig';
import {Edit} from './edit/Edit';
import {ExportIcs} from './export/ExportIcs';
import {About} from './about/About';

export const ROUTES={
    homepage: 'homepage',
    import_elective: 'import_elective',
    import_isop: 'import_isop',
    import_config: 'import_config',
    edit: 'edit',
    export_ics: 'export_ics',
    about: 'about',
};

export const PAGE={
    homepage: Homepage,
    import_elective: ImportElective,
    import_isop: ImportIsop,
    import_config: ImportConfig,
    edit: Edit,
    export_ics: ExportIcs,
    about: About,
};

export function RouteNotFound(props) {
    return (
        <PageHeader title="Not Found" onBack={()=>{props.navigate(ROUTES.homepage);}} />
    );
}