"use strict";

export default function AnchorListClick(list: any[], viewSelector, clickAction, className) {
    if (list) {
        return (
            <>
                {list.map( (item, index) => {
                    return <a onClick={clickAction} key={index} className={className}>{viewSelector(item)}</a>
                })}
            </>
        );
    }
    else {
        return <></>;
    }
}