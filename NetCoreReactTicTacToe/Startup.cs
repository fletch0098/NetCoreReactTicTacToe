using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.SpaServices.Webpack;
using NetCoreReactTicTacToe.Hubs;
using Microsoft.EntityFrameworkCore;

namespace NetCoreReactTicTacToe
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().AddSessionStateTempDataProvider(); ;

            //services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();
            services.AddSession();
            services.AddMemoryCache();
            services.AddDbContext<TicTactoeDbContext>(opt => opt.UseInMemoryDatabase("TicTactoeDb"));

            // Adds a default in-memory implementation of IDistributedCache.
            services.AddDistributedMemoryCache();

            services.AddCors(options =>
            {
                // BEGIN01
                options.AddPolicy("AllowSpecificOrigins",
                builder =>
                {
                    builder.WithOrigins("http://172.19.21.7:3000", "http://localhost:3000");
                });
                // END01

                // BEGIN02
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin();
                    });
                // END02

                // BEGIN03
                options.AddPolicy("AllowSpecificMethods",
                    builder =>
                    {
                        builder.WithOrigins("http://172.19.21.7:3000")
                               .WithMethods("GET", "POST", "HEAD");
                    });
                // END03

                // BEGIN04
                options.AddPolicy("AllowAllMethods",
                    builder =>
                    {
                        builder.WithOrigins("http://172.19.21.7:3000")
                               .AllowAnyMethod();
                    });
                // END04

                // BEGIN05
                options.AddPolicy("AllowHeaders",
                    builder =>
                    {
                        builder.WithOrigins("http://172.19.21.7:3000")
                               .WithHeaders("accept", "content-type", "origin", "x-custom-header");
                    });
                // END05

                // BEGIN06
                options.AddPolicy("AllowAllHeaders",
                    builder =>
                    {
                        builder.WithOrigins("http://172.19.21.7:3000")
                               .AllowAnyHeader();
                    });
                // END06

                // BEGIN07
                options.AddPolicy("ExposeResponseHeaders",
                    builder =>
                    {
                        builder.WithOrigins("http://172.19.21.7:3000")
                               .WithExposedHeaders("x-custom-header");
                    });
                // END07

                // BEGIN08
                options.AddPolicy("AllowCredentials",
                    builder =>
                    {
                        builder.WithOrigins("http://172.19.21.7:3000")
                               .AllowCredentials();
                    });
                // END08

                // BEGIN09
                options.AddPolicy("SetPreflightExpiration",
                    builder =>
                    {
                        builder.WithOrigins("http://172.19.21.7:3000")
                               .SetPreflightMaxAge(TimeSpan.FromSeconds(2520));
                    });
                // END09
                options.AddPolicy("LocalDev",
                    policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

                options.AddPolicy("CorsPolicyLocal",
            builder =>
            {
                builder.AllowAnyMethod().AllowAnyHeader()
                       .WithOrigins("http://172.19.21.7:3000/")
                       .AllowCredentials();
            });
                options.AddPolicy("CorsPolicyNetwork",
            builder =>
            {
                builder.AllowAnyMethod().AllowAnyHeader()
                       .WithOrigins("http://172.19.21.7:3000")
                       .AllowCredentials();
            });
            });

            services.AddSignalR();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }


            app.UseStaticFiles();
            app.UseSession();
            app.UseSpaStaticFiles();

            app.UseCors("CorsPolicyLocal");

            app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/chathub");
                routes.MapHub<TicTacToeHub>("/tictactoehub");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
