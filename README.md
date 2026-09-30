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
- If the consumer is not running but `npx tsx src/producer.ts` is still run, the the messages should be stored in the queue as 'Unacked' until the consumer is back online


## Roadmap

### Stage 1 - Hello RabbitMQ
[Guide](https://dev.to/harshit_bhardwaj_37bd0c14/getting-started-with-rabbitmq-in-nodejs-typescript-16km)
- [x] Run RabbitMQ locally
- [x] Access the RabbitMQ Management UI
- [x] Connect to RabbitMQ from a basic TypeScript project
- [x] Send a simple message from a producer to a consumer

### Stage 2 - Basic Events
- [x] Create a simple event object
- [x] Serialise the event to JSON
- [x] Publish the event
- [x] Consume the event
- [x] Deserialise the event
- [x] Perform an action based on the event

### Stage 3 - TypeScript Event Types
- [ ] Define TypeScript event interfaces/types
- [ ] Create multiple event types
- [ ] Add common event metadata
- [ ] Validate incoming messages
- [ ] Handle unknown or malformed events

### Stage 4 - Exchanges and Routing

### Stage 5 - Simulated Draft - Risk Assessment Integration

### Stage 6 - Message Acknowledgements

### Stage 7 - Failures and Reliability

### Stage 8 - Multiple Consumers

### Stage 9 - Realisitc Event Design

### Stage 10 - Prototype
