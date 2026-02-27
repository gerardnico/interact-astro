/**
 * Adapted from
 * https://github.com/markdoc/docs/blob/main/components/Callout.js
 */
export default function Callout({children, type}) {

    return (
        <div className={type + ' callout'}>
            <span>{children}</span>
        </div>
    );
}
