import { APIGatewayProxyEvent } from "aws-lambda";

export function getUserId(evt: APIGatewayProxyEvent): string {
    return "user123" + evt.isBase64Encoded
}