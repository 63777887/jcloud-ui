export const formatDataSize = (size: number, unit: string): string => {
    const byteSizes = ['B', 'KB', 'MB', 'GB'];
    let convertedSize = size;
    let unitIndex = byteSizes.indexOf(unit.toUpperCase());

    if (unitIndex === -1) {
        return 'Invalid unit';
    }

    while (convertedSize >= 1024 && unitIndex < byteSizes.length - 1) {
        convertedSize /= 1024;
        unitIndex++;
    }

    return `${convertedSize.toFixed(2)} ${byteSizes[unitIndex]}`;
}


export const convertToMB = (size: number, unit: string) => {
    const byteSizes = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
    };

    if (unit in byteSizes) {
        const bytes = size * byteSizes[unit];
        return bytes / byteSizes['MB'];
    }

    return NaN; // 非法的单位
}
