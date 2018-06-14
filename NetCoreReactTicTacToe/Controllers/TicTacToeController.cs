using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NetCoreReactTicTacToe.Models;

namespace NetCoreReactTicTacToe.Controllers
{
    [Produces("application/json")]
    [Route("api/TicTacToe")]
    public class TicTacToeController : Controller
    {
        // GET: api/<controller>
        [HttpGet("[action]")]
        public IEnumerable<UserDetails> LoggedOnUsers()
        {
            return new[]{
            new UserDetails { UserId = 1, Initials = "BMF", Player= "X" },
            new UserDetails { UserId = 2, Initials = "FPS", Player= "O" }
            };
        }

        [HttpGet("[action]")]
        public IEnumerable<Moves> InitialMoves()
        {
            return new[]{
            new Moves { MoveId = 1, Col = 1, Row=1, Player= "X" },
            new Moves { MoveId = 2, Col = 2, Row=2, Player= "O" }
            };
        }
    }
}