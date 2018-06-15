using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NetCoreReactTicTacToe.Models
{
    public class Message
    {
        public int MessageId { get; set; }
        public string Name { get; set; }
        public string MessageText { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
