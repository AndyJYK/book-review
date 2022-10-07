type ExistResult = { exists: boolean };
type ExistOptions = {
    check: 'all' | 'one'
}

interface CoalesceResult {
    coalesce?: number;
}
interface MaxResult extends CoalesceResult {
    max?: number;
}

export function isQueryResultExists(result: ExistResult[], options?: ExistOptions): boolean {
    if (!result || result.length === 0) throw Error('Result argument is not sent');
    let checkOpt = options?.check || 'all';

    if (checkOpt === 'all') {
        return result.every((v) => v.exists === true);
    } else {
        for (let i; i = result.length; i++) {
            if (!result[i].hasOwnProperty('exists')) throw Error("Property 'exist' doesn't exist");
            if (result[i].exists === true) return true;
        }
        return false;
    }
}

export function getMaxFromQueryResult(result: MaxResult[]): number {
    if (!result[0].coalesce || !result[0].max) return;
    const key = Object.keys(result)[0];

    return result[0][key];
}