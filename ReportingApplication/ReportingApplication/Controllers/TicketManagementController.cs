using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ReportingApplication.Interfaces.Controllers;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Ticket;
using System.Xml.Linq;

namespace ReportingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator, Worker")]
    public class TicketManagementController : ControllerBase, ITicketManagementController
    {
        private readonly ITicketManagementService _ticketService;

        public TicketManagementController(ITicketManagementService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpPost("addTicket")]
        [Authorize(Roles = "Worker")]
        public async Task<ActionResult> addTicket([FromForm] NewTicketDTO newTicketDTO)
        {
            TicketDTO? result = await _ticketService.addTicket(newTicketDTO);

            if (result == null)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        [HttpGet("showTickets")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<List<TicketDTO>>> showTickets()
        {
            List<TicketDTO> ticketsDTO = await _ticketService.showTickets();

            return Ok(ticketsDTO);
        }

        [HttpGet("showTicket/{ticketId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<TicketDTO>> showTicket(Guid ticketId)
        {
            TicketDTO? ticketsDTO = await _ticketService.showTicket(ticketId);

            if (ticketsDTO == null)
            {
                return BadRequest();
            }

            return Ok(ticketsDTO);
        }

        [HttpGet("doesUserHaveAnyTickets/{userId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<bool>> doesUserHaveAnyTickets(string userId)
        {
            bool result = await _ticketService.doesUserHaveAnyTickets(userId);

            return Ok(result);
        }

        [HttpGet("downloadAttachment/{ticketId}/{attachmentId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult> downloadAttachment(Guid ticketId, int attachmentId)
        {
            (byte[] file, string fileName)? attachment = await _ticketService.downloadAttachment(ticketId, attachmentId);

            if (attachment.Value.file is null || attachment.Value.fileName is null)
            {
                return BadRequest();
            }

            return File(attachment.Value.file, "application/octet-stream", attachment.Value.fileName);
        }

        [HttpPut("isRead/{ticketId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<bool>> isRead(Guid ticketId)
        {
            bool result = await _ticketService.isRead(ticketId);

            if (result == false)
            {
                return BadRequest();
            }

            return Ok();
        }

        /*[HttpPut("takeTicket/{ticketId}/{userId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<bool>> takeTicket(string userId, Guid ticketId)
        {
            bool result = await _ticketService.takeTicket(ticketId, userId);

            if (result == false)
            {
                return BadRequest();
            }

            return Ok();
        }*/
    }
}
