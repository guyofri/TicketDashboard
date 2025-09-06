using AutoMapper;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Domain.Entities;
using TicketDashboard.Domain.Enums;

namespace TicketDashboard.Application.Mapping;

public class TicketMappingProfile : Profile
{
    public TicketMappingProfile()
    {
        // Ticket mappings
        CreateMap<Ticket, TicketDto>()
            .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CreatedById))
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => $"{src.CreatedBy.FirstName} {src.CreatedBy.LastName}"))
            .ForMember(dest => dest.AssignedToName, opt => opt.MapFrom(src => 
                src.AssignedTo != null ? $"{src.AssignedTo.FirstName} {src.AssignedTo.LastName}" : null))
            .ForMember(dest => dest.ResolvedAt, opt => opt.MapFrom(src => src.ClosedAt));

        CreateMap<CreateTicketDto, Ticket>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => TicketStatus.Open))
            .ForMember(dest => dest.CreatedById, opt => opt.Ignore()) // Will be set by service
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ClosedAt, opt => opt.Ignore())
            .ForMember(dest => dest.FirstResponseAt, opt => opt.Ignore())
            .ForMember(dest => dest.SlaId, opt => opt.Ignore())
            .ForMember(dest => dest.CustomerEmail, opt => opt.Ignore())
            .ForMember(dest => dest.Tags, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedTo, opt => opt.Ignore())
            .ForMember(dest => dest.Sla, opt => opt.Ignore())
            .ForMember(dest => dest.Comments, opt => opt.Ignore())
            .ForMember(dest => dest.SlaViolations, opt => opt.Ignore())
            .ForMember(dest => dest.RoutingLogs, opt => opt.Ignore());

        CreateMap<UpdateTicketDto, Ticket>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedById, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ClosedAt, opt => opt.Ignore())
            .ForMember(dest => dest.FirstResponseAt, opt => opt.Ignore())
            .ForMember(dest => dest.SlaId, opt => opt.Ignore())
            .ForMember(dest => dest.CustomerEmail, opt => opt.Ignore())
            .ForMember(dest => dest.Tags, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedTo, opt => opt.Ignore())
            .ForMember(dest => dest.Sla, opt => opt.Ignore())
            .ForMember(dest => dest.Comments, opt => opt.Ignore())
            .ForMember(dest => dest.SlaViolations, opt => opt.Ignore())
            .ForMember(dest => dest.RoutingLogs, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        // Comment mappings
        CreateMap<TicketComment, TicketCommentDto>()
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => $"{src.Author.FirstName} {src.Author.LastName}"));

        CreateMap<CreateTicketCommentDto, TicketComment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AuthorId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Author, opt => opt.Ignore())
            .ForMember(dest => dest.Ticket, opt => opt.Ignore());
    }
}