'use client';

import { JsonInput } from './JsonInput';
import { JsonOutput } from './JsonOutput';
import { ControlPanel } from './ControlPanel';

export function JsonFormatter() {
    return (
        <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] gap-4">
            <ControlPanel />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <JsonInput />
                <JsonOutput />
            </div>
        </div>
    );
}
