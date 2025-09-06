using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Application.Mapping;

namespace TicketDashboard.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register AutoMapper with mapping profiles
        services.AddAutoMapper(typeof(AuthMappingProfile), typeof(TicketMappingProfile), typeof(AgentMappingProfile));
        
        // Register FluentValidation (basic validators only for now)
        services.AddValidatorsFromAssemblyContaining<AuthMappingProfile>();
        
        return services;
    }
}