using AutoMapper;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Domain.Entities;

namespace TicketDashboard.Application.Mapping;

public class AgentMappingProfile : Profile
{
    public AgentMappingProfile()
    {
        // User to AgentDto mapping (since agents are users with specific roles)
        CreateMap<User, AgentDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.AssignedTicketsCount, opt => opt.MapFrom(src => 0)); // Default to 0 for now

        CreateMap<CreateAgentDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => "Agent"))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore());
    }
}