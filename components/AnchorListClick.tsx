"use strict";

export default function AnchorListClick(list: any[], viewSelector, clickAction, valueSelector?, className?) {
    if (list) {
        return (
            <>
                {list.map( (item, index) => {
                    return (
                        <a onClick={clickAction} key={index} className={className}>
                            {valueSelector && <input type="hidden" value={valueSelector(item)}/>}
                            {viewSelector(item)}
                        </a>
                    )
                })}
            </>
        );
    }
    else {
        return <></>;
    }
}