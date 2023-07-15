import { provide, inject, reactive } from 'vue';

const EventBusSymbol = Symbol();
const eventBus = reactive({});

export function provideEventBus() {
  provide(EventBusSymbol, eventBus);
}

export function useEventBus() {
  const bus = inject(EventBusSymbol);
  if (!bus) {
    throw new Error('EventBus not found. Make sure you have called provideEventBus() in a parent component.');
  }
  return bus;
}
