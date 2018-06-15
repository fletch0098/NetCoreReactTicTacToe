using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using NetCoreReactTicTacToe.Models;
using Microsoft.EntityFrameworkCore;

namespace NetCoreReactTicTacToe.Hubs
{
    public class ChatHub : Hub
    {
        TicTactoeDbContext ctx;

        public ChatHub(TicTactoeDbContext c)
        {
            ctx = c;
        }

        public void SendToAll(string name, string message)
        {
            Message NewMessage = new Message();
            
            int newId = ctx.Message.Count() + 1;
                //NewMessage.MessageId = newId;
                NewMessage.Name = name;
                NewMessage.Timestamp = DateTime.Now;
                NewMessage.MessageText = message;
                ctx.Message.Add(NewMessage);
                ctx.SaveChanges();

            Clients.All.SendAsync("sendToAll", NewMessage.Timestamp, NewMessage.Name, NewMessage.MessageText);
        }

        public void sendMove(string i)
        {
            Clients.All.SendAsync("sendMove", i);
        }
        public void newChatUser(string name)
        {
            int NumberOfPlayers = ctx.Player.Count();
            string AdminUser = "Chat Admin";

            if (NumberOfPlayers > 1)
            {
                string Message = "Chat full please refresh";
                Clients.Caller.SendAsync("chatFull", Message);
            }
            else
            {
                List<Player> Players = new List<Player>();
                Players = ctx.Player.ToList();

                Player NewPlayer = new Player();
                NewPlayer.PlayerName = name;

                if (NumberOfPlayers == 0)
                {
                    NewPlayer.PlayerXorO = "X";
                }
                else
                {
                    NewPlayer.PlayerXorO = "O";
                }

                ctx.Player.Add(NewPlayer);

                List<Message> Messages = new List<Message>();
                Messages = ctx.Message.ToList();

                string message = name + " has entered the room.";
 
                Message NewMessage = new Message();
                NewMessage.Name = name;
                NewMessage.Timestamp = DateTime.Now;
                NewMessage.MessageText = message;
                ctx.Message.Add(NewMessage);

                ctx.SaveChanges();

                Clients.Caller.SendAsync("catchUpNewPlayer", Messages, Players);
                Clients.All.SendAsync("loadNewPlayer", NewPlayer);
                Clients.All.SendAsync("sendToAll", NewMessage.Timestamp, AdminUser, NewMessage.MessageText);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            ctx.Message.RemoveRange(ctx.Message.ToList());
            ctx.Player.RemoveRange(ctx.Player.ToList());
            ctx.SaveChanges();

            string Message = "Player disconnected, please refresh";
            await Clients.All.SendAsync("playerDisconnected", Message);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
