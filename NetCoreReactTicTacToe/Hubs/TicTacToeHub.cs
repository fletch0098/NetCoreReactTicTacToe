using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;


namespace NetCoreReactTicTacToe.Hubs
{
    public class TicTacToeHub : Hub
    {
        public void SendToAll(string player, int row, int col)
        {
            Clients.All.SendAsync("sendToAll", player, row, col);
        }

        public void NewPlayer(string PlayerName, string Player)
        {
            Clients.All.SendAsync("NewPlayer", PlayerName, Player);
        }
    }
}
