export function currencyDecimal(value) {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(value)
}

export function numberFormatThousands(value) {
    if (value > 0) {
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    } else {
        return 0
    }
}
