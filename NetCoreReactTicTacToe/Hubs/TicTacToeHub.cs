using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;


namespace NetCoreReactTicTacToe.Hubs
{
    public class TicTacToeHub: Hub
    {
        public void AddMessage(string message)
        {
            var chatMessage = new object[2];
            // Call the MessageAdded method to update clients.
            Clients.All.SendCoreAsync("MessageAdded", chatMessage);
        }
    }
}
