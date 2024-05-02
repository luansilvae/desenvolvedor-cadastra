export function formattedCurrency(value: number): string {
  const formattedValue = value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  })

  return formattedValue
}
