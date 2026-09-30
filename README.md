# rmq-ts-playground

A small TypeScript project for learning RabbitMQ and event-driven communication between different systems.

As the new ERA system will be written in TypeScript, that is the language I will be focusing on utilising here.

## Startup
1. Check if RabbitMQ is running with `Get-Service RabbitMQ`
2. If `Status` is `Stopped`:
   - `cd "C:\Program Files\RabbitMQ Server\rabbitmq_server-4.3.6\sbin"` Note: version number might change
   - run `.\rabbitmq-server.bat`
3. Go to `http://localhost:15672/`

## Usage
- In one terminal run `npx tsx src/consumer.ts`
   - This is the consumer terminal that should be waiting for messages in the subscribed queue
- In another terminal run `npx tsx src/producer.ts`
   - Every time this is run a message is sent to the subscribed queue
   - The consumer terminal should display this message


## Roadmap

### Stage 1 - Hello RabbitMQ
- [ ] Run RabbitMQ locally
- [ ] Access the RabbitMQ Management UI

### Stage 2 - Basic Events

### Stage 3 - TypeScript Event Types

### Stage 4 - Exchanges and Routing

### Stage 5 - Simulated Draft - Risk Assessment Integration

### Stage 6 - Message Acknowledgements

### Stage 7 - Failures and Reliability

### Stage 8 - Multiple Consumers

### Stage 9 - Realisitc Event Design

### Stage 10 - Prototype
