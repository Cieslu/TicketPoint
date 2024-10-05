using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using ReportingApplication.Models;

namespace ReportingApplication.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        //public DbSet<User> Users { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        //public DbSet<Recipent> Recipents { get; set; }
        public DbSet<TicketRecipent> TicketRecipents { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Ignore<IdentityRoleClaim<string>>();
            builder.Ignore<IdentityUserClaim<string>>();
            builder.Ignore<IdentityUserLogin<string>>();
            builder.Ignore<IdentityUserToken<string>>();

            builder.Entity<User>(option =>
            {
                option.ToTable(name: "Users");
                //option.Ignore(x => x.NormalizedUserName);
                //option.Ignore(x => x.NormalizedEmail);
                option.Ignore(x => x.EmailConfirmed);
                option.Ignore(x => x.SecurityStamp);
                option.Ignore(x => x.ConcurrencyStamp);
                option.Ignore(x => x.PhoneNumber);
                option.Ignore(x => x.PhoneNumberConfirmed);
                option.Ignore(x => x.TwoFactorEnabled);
                option.Ignore(x => x.LockoutEnd);
                option.Ignore(x => x.LockoutEnabled);
                option.Ignore(x => x.AccessFailedCount);
            });

            builder.Entity<IdentityRole>(option =>
            {
                option.ToTable(name: "Roles");
                option.Ignore(x => x.ConcurrencyStamp);
            });

            builder.Entity<IdentityUserRole<string>>(option =>
            {
                option.ToTable(name: "UserRoles");
            });

            builder.Entity<TicketRecipent>(option =>
            {
                option.HasKey(tr => new { tr.TicketId, tr.UserId });
                option.HasOne(tr => tr.Ticket)
                      .WithMany(t => t.TicketRecipents)
                      .HasForeignKey(tr => tr.TicketId)
                      .OnDelete(DeleteBehavior.NoAction);
                option.HasOne(tr => tr.Recipent)
                      .WithMany(u => u.TicketRecipents)
                      .HasForeignKey(tr => tr.UserId)
                      .OnDelete(DeleteBehavior.NoAction);
            });


/*            builder.Entity<Ticket>()
                .HasOne(t => t.Recipent)
                .WithMany(r => r.Tickets)
                .HasForeignKey(t => t.RecipentId)
                .HasForeignKey(t => t.RecipentId)
                .OnDelete(DeleteBehavior.ClientSetNull);*/
        }
    }
}
