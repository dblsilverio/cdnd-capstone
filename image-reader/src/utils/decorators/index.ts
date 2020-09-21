import { putCountMetric, putTimeMetric } from "../../services/metricService";
import { timeMillis } from "../infra/helpers";

export function traceDuration(operationName: string) {

    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const m = descriptor.value
        descriptor.value = function (...args: any[]) {
            const started = timeMillis()
            const result = m.apply(this, args)
            const finished = timeMillis()

            const totalTime = finished - started

            putTimeMetric(operationName, totalTime)

            return result
        }
    }
}

export function traceCount(operationName: string) {

    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const m = descriptor.value
        descriptor.value = function (...args: any[]) {
            const result = m.apply(this, args)
            putCountMetric(operationName)

            return result
        }
    }
}

