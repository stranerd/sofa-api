import { Schema } from 'equipped'

export const SelectedPaymentMethodSchema = Schema.or([Schema.string().min(1), Schema.is(true as const)])
	.nullable()
	.default(null)
