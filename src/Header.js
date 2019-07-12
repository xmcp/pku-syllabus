import React, {Component, PureComponent} from 'react';
import {AppSwitcher, GlobalTitle} from './infrastructure/widgets';

export function HeaderComp(props) {
    return (
        <AppSwitcher appid="syllabus" />
    );
}