using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NetCoreReactTicTacToe.Models
{
    public class Moves
    {
        public int MoveId { get; set; }
        public int Col { get; set; }
        public int Row { get; set; }
        public string Player { get; set; }
    }
}
