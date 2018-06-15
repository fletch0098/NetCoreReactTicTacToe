using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NetCoreReactTicTacToe.Models;
    
namespace NetCoreReactTicTacToe
{
    public class TicTactoeDbContext : DbContext
    {
        public TicTactoeDbContext(DbContextOptions<TicTactoeDbContext> options)
            : base(options)
        {
        }

        public DbSet<Player> Player { get; set; }
        public DbSet<Message> Message { get; set; }

    }
}
