import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

// Tracing só é ativado se o endpoint estiver configurado
if (endpoint) {
    const sdk = new NodeSDK({
        resource: resourceFromAttributes({
            [ATTR_SERVICE_NAME]: 'user-service',
            [ATTR_SERVICE_VERSION]: '1.0.0',
        }),
        traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
        instrumentations: [
            getNodeAutoInstrumentations({
                '@opentelemetry/instrumentation-fs': { enabled: false },
            }),
        ],
    });

    sdk.start();

    process.on('SIGTERM', () => sdk.shutdown().catch(() => {}));
    process.on('SIGINT', () => sdk.shutdown().catch(() => {}));
}
