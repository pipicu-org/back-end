import { Server } from 'socket.io';

export const io = new Server();

export function initializeWebSocket(): void {
  io.listen(3000);

  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });

  console.info('WebSocket inicializado en el puerto 3000');
}

export function emitWebSocketEvent(event: string, data: any): void {
  io.emit(event, data);
  console.log(`Evento WebSocket emitido: ${event}`, data);
}
